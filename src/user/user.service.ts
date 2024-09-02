import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository, ILike } from 'typeorm';
import { User } from './entity/user.entity';
import { Network } from 'src/network/entity/network.entity';
import { Asset } from 'src/asset/entity/asset.entity';
import { Contract } from 'src/contract/entity/contract.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from 'src/config/config.service';
import * as bcrypt from 'bcrypt';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import * as fs from 'fs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

const abiCCFL = JSON.parse(fs.readFileSync('abi/CCFL.json', 'utf8'));
const abiCCFLPool = JSON.parse(fs.readFileSync('abi/CCFLPool.json', 'utf8'));
const abiCCFLLoan = JSON.parse(fs.readFileSync('abi/CCFLLoan.json', 'utf8'));

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private jwtService: JwtService,
    private readonly emailService: MailerService,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Network)
    private networkRepository: Repository<Network>,

    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,

    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,

    private readonly i18n: I18nService,

    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async signUp(signupDto: SignUpDto) {
    try {
      const salt = await bcrypt.genSalt();

      const user = new User();
      user.username = signupDto.username;
      user.password = await bcrypt.hash(signupDto.password, salt);
      user.firstName = signupDto.firstName;
      user.lastName = signupDto.lastName;
      user.email = signupDto.email;
      user.isActive = true;

      const existUser = await this.userRepository.findOneBy({
        username: user.username,
      });
      if (existUser) {
        this.logger.error(
          this.i18n.translate('message.USERNAME_ALREADY_USED', {
            lang: I18nContext.current().lang,
          }),
        );
        throw new HttpException(
          this.i18n.translate('message.USERNAME_ALREADY_USED', {
            lang: I18nContext.current().lang,
          }),
          HttpStatus.BAD_REQUEST,
        );
      }

      const email = user.email;

      const token = this.jwtService.sign(
        { email },
        {
          secret: ConfigService.JWTConfig.secret,
          expiresIn: ConfigService.JWTConfig.expire,
        },
      );

      const link = `${ConfigService.App.domain}/user/verify-email?token=${token}`;

      await this.emailService.sendMail({
        to: user.email,
        subject: `Welcome to the FUSIONFI application`,
        template: './confirmation',
        context: {
          firstName: user.firstName,
          link,
        },
      });

      return await this.userRepository.save(user);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async signIn(username: string, password: string) {
    try {
      const user = await this.userRepository.findOneBy({ username });
      if (user?.emailVerified == false) {
        throw new UnauthorizedException(
          this.i18n.translate('message.EMAIL_NOT_VERIFIED', {
            lang: I18nContext.current().lang,
          }),
        );
      }
      if (user?.password) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException();
      }
      const payload = {
        sub: user.id,
        username: user.username,
        role: user.role,
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async verifyEmail(token: string) {
    try {
      const { email } = this.jwtService.verify(token, {
        secret: ConfigService.JWTConfig.secret,
      });

      if (email == null || email == undefined) {
        return;
      }

      const user = await this.userRepository.findOneBy({
        email,
      });

      if (!user) {
        return;
      }

      await this.userRepository.update(
        { email },
        {
          emailVerified: true,
        },
      );

      return {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        emailVerified: true,
        isActive: user.isActive,
      };
    } catch (e) {
      this.logger.error(
        `${this.i18n.translate('message.CANNOT_VERIFY_EMAIL', { lang: I18nContext.current().lang })}: ${e.message}`,
      );
      return;
    }
  }

  async sendForgotPasswordLink(email: string) {
    try {
      const user = await this.userRepository.findOneBy({ email });

      if (!user) {
        throw new NotFoundException(
          this.i18n.translate('message.USER_NOT_FOUND', {
            lang: I18nContext.current().lang,
          }),
        );
      }

      const token = this.jwtService.sign(
        { email },
        {
          secret: ConfigService.JWTConfig.secret,
          expiresIn: ConfigService.JWTConfig.expire,
        },
      );

      const link = `${ConfigService.App.domain}/user/restore-password?token=${token}`;

      await this.emailService.sendMail({
        to: email,
        subject: 'Reset your password on FUSIONFI application',
        template: './restore-password',
        context: {
          firstName: user.firstName,
          link,
        },
      });

      return true;
    } catch (e) {
      return false;
    }
  }

  async checkExistingUsername(username: string) {
    try {
      let exist = await this.userRepository.findOneBy({ username });
      if (exist) {
        return true;
      }
      return false;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async checkExistingEmail(email: string) {
    try {
      let exist = await this.userRepository.findOneBy({ email });
      if (exist) {
        return true;
      }
      return false;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async checkOldPassword(username: string, password: string) {
    try {
      const user = await this.userRepository.findOneBy({ username });

      if (user?.password) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return true;
        }
        return false;
      }

      return false;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async changePassword(token: string, password: string) {
    try {
      const { email } = this.jwtService.verify(token, {
        secret: ConfigService.JWTConfig.secret,
      });

      if (email == null || email == undefined) {
        return false;
      }

      const user = await this.userRepository.findOneBy({
        email,
      });

      if (!user) {
        return false;
      }

      const salt = await bcrypt.genSalt();
      const newPassword = await bcrypt.hash(password, salt);

      await this.userRepository.update(
        { email },
        {
          password: newPassword,
        },
      );

      return true;
    } catch (e) {
      this.logger.error(
        `${this.i18n.translate('message.CANNOT_CHANGE_PASSWORD', { lang: I18nContext.current().lang })}: ${e.message}`,
      );
      return false;
    }
  }

  async findAllUser() {
    try {
      return await this.userRepository.find();
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async getBalance(address: string, chainId: number, asset: string) {
    try {
      const key = `getBalance_${address}_${chainId}_${asset}`;
      const cacheData = await this.cacheManager.get(key);
      if (cacheData) {
        this.logger.log(`\n:return:cache:${key}`);
        return cacheData;
      }

      let balance = null;
      let decimals = null;

      const network = await this.networkRepository.findOneBy({
        isActive: true,
        chainId,
      });

      if (!network) {
        return {
          address,
          balance,
          decimals,
        };
      }

      const provider = new ethers.JsonRpcProvider(network.rpcUrl);

      if (asset.toUpperCase() == 'ETH') {
        const ethBalance = await provider.getBalance(address);
        balance = ethBalance.toString();
        decimals = 18;
      } else {
        const abi = ['function balanceOf(address) view returns (uint256)'];

        const token = await this.assetRepository.findOneBy({
          isActive: true,
          chainId,
          symbol: asset.toUpperCase(),
        });

        if (!token) {
          return {
            address,
            balance,
            decimals,
          };
        }

        const contract = new ethers.Contract(token.address, abi, provider);
        const tokenBalance = await contract.balanceOf(address);
        balance = tokenBalance.toString();
        decimals = token.decimals;
      }

      const data = {
        address: address,
        balance: balance,
        decimals: decimals,
      };

      this.cacheManager.store.set(key, data, ConfigService.Cache.ttl);

      return data;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async getAllSupply(address: string, chainId: number) {
    try {
      const key = `getAllSupply_${address}_${chainId}`;
      const cacheData = await this.cacheManager.get(key);
      if (cacheData) {
        this.logger.log(`\n:return:cache:${key}`);
        return cacheData;
      }

      const [network, allPools] = await Promise.all([
        this.networkRepository.findOneBy({
          isActive: true,
          chainId,
        }),
        this.contractRepository.findBy({
          isActive: true,
          type: ILike('pool'),
          chainId: chainId,
        }),
      ]);

      if (!network) {
        return {
          address,
          supplies: [],
          total_supply: null,
          net_apy: null,
          total_earned: null,
        };
      }

      const provider = new ethers.JsonRpcProvider(network.rpcUrl);

      const supplies = [];
      let netApy = BigNumber(0);
      let totalSupplyInUsd = BigNumber(0);
      for (const item of allPools) {
        const contract = new ethers.Contract(
          item.address,
          abiCCFLPool,
          provider,
        );

        const [
          share,
          currentRate,
          remainingPool,
          totalSupply,
          walletBalance,
          asset,
        ] = await Promise.all([
          contract.share(address),
          contract.getCurrentRate(),
          contract.getRemainingPool(),
          contract.getTotalSupply(),
          this.getBalance(address, chainId, item.asset),
          this.assetRepository.findOneBy({
            isActive: true,
            chainId,
            symbol: ILike(item.asset),
          }),
        ]);

        const supplyBalance = BigNumber(share.toString()).div(
          BigNumber(10).pow(27 - asset.decimals),
        );

        const apr = BigNumber(currentRate[1]).div(1e27).toFixed(8);
        const apy = BigNumber(1)
          .plus(BigNumber(apr).div(12))
          .pow(12)
          .minus(1)
          .toFixed(8);
        netApy = netApy.plus(apy);

        totalSupplyInUsd = totalSupplyInUsd.plus(
          supplyBalance
            .div(BigNumber(10).pow(asset.decimals))
            .times(asset.price),
        );

        supplies.push({
          asset: item.asset,
          decimals: asset.decimals,
          asset_price: asset.price,
          supply_balance: supplyBalance.toFixed(),
          earned_reward: null,
          apy,
          wallet_balance: (walletBalance as { balance: number }).balance,
          pool_utilization: BigNumber(remainingPool)
            .div(totalSupply)
            .toFixed(8),
          withdraw_available: null,
        });
      }

      const data = {
        address: address,
        supplies: supplies,
        total_supply: totalSupplyInUsd.toFixed(),
        net_apy:
          supplies.length == 0 ? null : netApy.div(supplies.length).toFixed(8),
        total_earned: null,
      };

      this.cacheManager.store.set(key, data, ConfigService.Cache.ttl);

      return data;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async getAllLoan(address: string, chainId: number) {
    try {
      const key = `getAllLoan_${address}_${chainId}`;
      const cacheData = await this.cacheManager.get(key);
      if (cacheData) {
        this.logger.log(`\n:return:cache:${key}`);
        return cacheData;
      }

      const [network, ccfl] = await Promise.all([
        this.networkRepository.findOneBy({
          isActive: true,
          chainId,
        }),
        this.contractRepository.findOneBy({
          isActive: true,
          type: ILike('ccfl'),
          chainId,
        }),
      ]);

      if (!network) {
        return {
          address,
          loans: [],
          net_apr: null,
          finance_health: null,
        };
      }

      const provider = new ethers.JsonRpcProvider(network.rpcUrl);

      const contractCCFL = new ethers.Contract(ccfl.address, abiCCFL, provider);

      const loanIds = await contractCCFL.getLoanIds(address);
      const maploanIds = loanIds.map((loan: BigNumber) => loan.toString());

      const allLoans = [];
      let netApr = BigNumber(0);
      let totalLoan = BigNumber(0);
      let totalCollateral = BigNumber(0);
      for (const loanId of maploanIds) {
        const loanAddress = await contractCCFL.getLoanAddress(loanId);

        const contractLoan = new ethers.Contract(
          loanAddress,
          abiCCFLLoan,
          provider,
        );

        const [loanInfo, collateralAmount, collateralToken, isYieldGenerating] =
          await Promise.all([
            contractLoan.getLoanInfo(),
            contractLoan.collateralAmount(),
            contractLoan.collateralToken(),
            contractLoan.isStakeAave(),
          ]);

        let yieldEarned = null;
        let healthFactor = null;
        if (!loanInfo.isClosed && !loanInfo.isLiquidated) {
          [yieldEarned, healthFactor] = await Promise.all([
            contractLoan.getYieldEarned(),
            contractCCFL.getHealthFactor(loanId),
          ]);
        }

        const [asset, collateral] = await Promise.all([
          this.assetRepository.findOneBy({
            isActive: true,
            chainId,
            address: ILike(loanInfo.stableCoin),
          }),
          this.assetRepository.findOneBy({
            isActive: true,
            chainId,
            address: ILike(collateralToken),
          }),
        ]);

        const pool = await this.contractRepository.findOneBy({
          isActive: true,
          type: ILike('pool'),
          chainId,
          asset: ILike(asset.symbol),
        });

        const contractPool = new ethers.Contract(
          pool.address,
          abiCCFLPool,
          provider,
        );

        const [currentRate, debtRemain] = await Promise.all([
          contractPool.getCurrentRate(),
          contractPool.getCurrentLoan(loanId),
        ]);

        const apr = BigNumber(currentRate[0]).div(1e27).toFixed(8);
        netApr = netApr.plus(apr);

        totalLoan = totalLoan.plus(
          BigNumber(loanInfo.amount.toString())
            .div(BigNumber(10).pow(asset.decimals))
            .times(asset.price),
        );
        totalCollateral = totalCollateral.plus(
          BigNumber(collateralAmount.toString())
            .div(BigNumber(10).pow(collateral.decimals))
            .times(collateral.price),
        );

        allLoans.push({
          asset: asset.symbol,
          decimals: asset.decimals,
          loan_size: loanInfo.amount.toString(),
          asset_price: asset.price,
          apr,
          health: healthFactor
            ? BigNumber(healthFactor).div(100).toFixed()
            : null,
          is_closed: loanInfo.isClosed,
          is_liquidated: loanInfo.isLiquidated,
          debt_remain: debtRemain.toString(),
          collateral_amount: collateralAmount.toString(),
          collateral_asset: collateral.symbol,
          collateral_decimals: collateral.decimals,
          collateral_price: collateral.price,
          yield_generating: isYieldGenerating,
          yield_earned: yieldEarned ? yieldEarned.toString() : null,
        });
      }

      const data = {
        address: address,
        loans: allLoans,
        net_apr:
          allLoans.length == 0 ? null : netApr.div(allLoans.length).toFixed(8),
        total_loan: totalLoan.toFixed(),
        total_collateral: totalCollateral.toFixed(),
        finance_health: null,
      };

      this.cacheManager.store.set(key, data, ConfigService.Cache.ttl);

      return data;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
