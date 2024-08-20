import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
  NotFoundException,
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
        subject: `Welcome to the CCFL application`,
        template: './confirmation',
        context: {
          username: user.username,
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
        subject: 'Reset your password on CCFL application',
        template: './restore-password',
        context: {
          username: user.username,
          link,
        },
      });

      return true;
    } catch (e) {
      return false;
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

  async findOne(username: string) {
    try {
      const result: User = await this.userRepository.findOneBy({ username });
      return result;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async findAllUser() {
    try {
      return await this.userRepository.find();
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async remove(id: string) {
    try {
      await this.userRepository.delete(id);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async getBalance(address: string, chainId: number, asset: string) {
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

    return {
      address,
      balance,
      decimals,
    };
  }

  async getAllSupply(address: string, chainId: number) {
    const network = await this.networkRepository.findOneBy({
      isActive: true,
      chainId,
    });

    if (!network) {
      return {
        address,
        supplies: [],
        // total_supply: null,
        net_apy: null,
        // total_earned: null
      };
    }

    const allPools = await this.contractRepository.findBy({
      isActive: true,
      type: ILike('pool'),
      chainId: chainId,
    });

    const provider = new ethers.JsonRpcProvider(network.rpcUrl);

    const supplies = [];
    let netApy = BigNumber(0);
    for (const item of allPools) {
      const contract = new ethers.Contract(item.address, abiCCFLPool, provider);
      const supplyBalance = await contract.balance(address);

      const currentRate = await contract.getCurrentRate();
      const apr = BigNumber(currentRate[1]).div(1e27).toFixed(8);
      const apy = BigNumber(1)
        .plus(BigNumber(apr).div(12))
        .pow(12)
        .minus(1)
        .toFixed(8);
      netApy = netApy.plus(apy);

      const walletBalance = await this.getBalance(address, chainId, item.asset);

      const remainingPool = await contract.getRemainingPool();
      const totalSupply = await contract.getTotalSupply();

      const asset = await this.assetRepository.findOneBy({
        isActive: true,
        chainId,
        symbol: ILike(item.asset),
      });

      supplies.push({
        asset: item.asset,
        decimals: asset.decimals,
        supply_balance: supplyBalance.toString(),
        earned_reward: null,
        apy,
        wallet_balance: walletBalance.balance,
        pool_utilization: BigNumber(remainingPool).div(totalSupply).toFixed(8),
        withdraw_available: null,
      });
    }

    return {
      address,
      supplies,
      // total_supply: null,
      net_apy:
        supplies.length == 0 ? null : netApy.div(supplies.length).toFixed(8),
      // total_earned: null
    };
  }

  async getAllLoan(address: string, chainId: number) {
    const network = await this.networkRepository.findOneBy({
      isActive: true,
      chainId,
    });

    if (!network) {
      return {
        address,
        loans: [],
        net_apr: null,
        finance_health: null,
      };
    }

    const provider = new ethers.JsonRpcProvider(network.rpcUrl);

    const ccfl = await this.contractRepository.findOneBy({
      isActive: true,
      type: ILike('ccfl'),
      chainId: chainId,
    });

    const contractCCFL = new ethers.Contract(ccfl.address, abiCCFL, provider);

    const loanIds = await contractCCFL.getLoanIds(address);
    const maploanIds = loanIds.map((loan: BigNumber) => loan.toString());

    const allLoans = [];
    let netApr = BigNumber(0);
    for (const loanId of maploanIds) {
      const loanAddress = await contractCCFL.getLoanAddress(loanId);

      const healthFactor = await contractCCFL.getHealthFactor(loanId);

      const contractLoan = new ethers.Contract(
        loanAddress,
        abiCCFLLoan,
        provider,
      );

      const loanInfo = await contractLoan.getLoanInfo();

      const isYieldGenerating = await contractLoan.isStakeAave();

      const collateralAmount = await contractLoan.collateralAmount();

      const collateralToken = await contractLoan.collateralToken();

      const asset = await this.assetRepository.findOneBy({
        isActive: true,
        chainId,
        address: ILike(loanInfo.stableCoin),
      });

      const pool = await this.contractRepository.findOneBy({
        isActive: true,
        type: ILike('pool'),
        chainId: chainId,
        asset: ILike(asset.symbol),
      });

      const contractPool = new ethers.Contract(
        pool.address,
        abiCCFLPool,
        provider,
      );
      const currentRate = await contractPool.getCurrentRate();
      const apr = BigNumber(currentRate[0]).div(1e27).toFixed(8);
      netApr = netApr.plus(apr);

      const debtRemain = await contractPool.getCurrentLoan(loanId);

      const collateral = await this.assetRepository.findOneBy({
        isActive: true,
        chainId,
        address: ILike(collateralToken),
      });

      allLoans.push({
        asset: asset.symbol,
        decimals: asset.decimals,
        loan_size: loanInfo.amount.toString(),
        apr,
        health: BigNumber(healthFactor).div(100).toFixed(),
        is_closed: loanInfo.isClosed,
        is_liquidated: loanInfo.isLiquidated,
        debt_remain: debtRemain.toString(),
        collateral_amount: collateralAmount.toString(),
        collateral_asset: collateral.symbol,
        collateral_decimals: collateral.decimals,
        yield_generating: isYieldGenerating,
        yield_earned: null,
      });
    }

    return {
      address,
      loans: allLoans,
      net_apr:
        allLoans.length == 0 ? null : netApr.div(allLoans.length).toFixed(8),
      finance_health: null,
    };
  }
}
