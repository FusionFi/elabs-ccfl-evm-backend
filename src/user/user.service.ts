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
import { Setting } from 'src/setting/entity/setting.entity';
import { User } from './entity/user.entity';
import { Subscriber } from './entity/subscriber.entity';
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
import axios from 'axios';

const abiCCFL = JSON.parse(fs.readFileSync('abi/CCFL.json', 'utf8'));
const abiCCFLPool = JSON.parse(fs.readFileSync('abi/CCFLPool.json', 'utf8'));
const abiCCFLLoan = JSON.parse(fs.readFileSync('abi/CCFLLoan.json', 'utf8'));

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private jwtService: JwtService,
    private readonly emailService: MailerService,

    @InjectRepository(Setting)
    private settingRepository: Repository<Setting>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Subscriber)
    private subscriberRepository: Repository<Subscriber>,

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

      const encryptusToken = await this.settingRepository.findOneBy({
        key: 'ENCRYPTUS_TOKEN',
      });

      try {
        const data = JSON.stringify({
          email: signupDto.email,
        });

        const configCreateUser = {
          method: 'POST',
          url: `${ConfigService.Encryptus.url}/v1/partners/create/user`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${encryptusToken.value}`,
          },
          data: data,
        };

        const encryptusUser = await axios(configCreateUser);
        user.encryptusId = encryptusUser?.data?.data?._id;
      } catch (error) {
        const configFetchallUser = {
          method: 'GET',
          url: `${ConfigService.Encryptus.url}/v1/partners/fetchall/user`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${encryptusToken.value}`,
          },
        };

        const result = await axios(configFetchallUser);

        const info = result.data.data.usersList.find(
          (item) => item.email === signupDto.email,
        );

        user.encryptusId = info._id;
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

      const token = await this.settingRepository.findOneBy({
        key: 'ENCRYPTUS_TOKEN',
      });

      const configUserInfo = {
        method: 'GET',
        url: `${ConfigService.Encryptus.url}/v1/partners/user/${user.encryptusId}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      };

      const result = await axios(configUserInfo);

      const payload = {
        username: user.username,
        email: user.email,
        role: user.role,
        encryptus_id: user.encryptusId || null,
        kyc_info: result?.data?.data?.data?.kyc_info || null,
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (e) {
      if (e?.response) {
        throw new HttpException(
          e?.response?.data?.message,
          e?.response?.status,
        );
      } else {
        throw new HttpException(e?.response, e?.status);
      }
    }
  }

  async signInWithEmail(email: string, password: string) {
    try {
      const user = await this.userRepository.findOneBy({ email });
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

      const token = await this.settingRepository.findOneBy({
        key: 'ENCRYPTUS_TOKEN',
      });

      const configUserInfo = {
        method: 'GET',
        url: `${ConfigService.Encryptus.url}/v1/partners/user/${user.encryptusId}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      };

      const result = await axios(configUserInfo);

      const payload = {
        username: user.username,
        email: user.email,
        role: user.role,
        encryptus_id: user.encryptusId || null,
        kyc_info: result?.data?.data?.data?.kyc_info || null,
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (e) {
      if (e?.response) {
        throw new HttpException(
          e?.response?.data?.message,
          e?.response?.status,
        );
      } else {
        throw new HttpException(e?.response, e?.status);
      }
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
        url: `${ConfigService.App.frontend_url}/my-profile?token=${token}`,
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

      const link = `${ConfigService.App.frontend_url}/my-profile?token=${token}`;

      await this.emailService.sendMail({
        to: email,
        subject: 'Reset your password on FUSIONFI application',
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

  async checkExistingUsername(username: string) {
    try {
      const exist = await this.userRepository.findOneBy({ username });
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
      const exist = await this.userRepository.findOneBy({ email });
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
      let totalEarned = BigNumber(0);
      for (const item of allPools) {
        const contract = new ethers.Contract(
          item.address,
          abiCCFLPool,
          provider,
        );

        const [
          originSupply,
          balanceOf,
          currentRate,
          remainingPool,
          totalSupply,
          walletBalance,
          asset,
        ] = await Promise.all([
          contract.getDepositWithdrawAmount(address),
          contract.balanceOf(address),
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

        const supplyAndProfit = BigNumber(balanceOf.toString());

        const apr = BigNumber(currentRate[1]).div(1e27).toFixed(8);
        const seconds = ConfigService.App.seconds_per_year;
        const apy = (1 + parseFloat(apr) / seconds) ** seconds - 1;
        netApy = netApy.plus(apy);

        totalSupplyInUsd = totalSupplyInUsd.plus(
          BigNumber(originSupply.toString())
            .div(BigNumber(10).pow(asset.decimals))
            .times(asset.price),
        );

        const profit = supplyAndProfit.minus(originSupply.toString()).toFixed();
        totalEarned = totalEarned.plus(profit);

        supplies.push({
          asset: item.asset,
          decimals: asset.decimals,
          asset_price: asset.price,
          supply_balance: originSupply.toString(),
          earned_reward: profit,
          apy: BigNumber(apy).toFixed(8),
          wallet_balance: (walletBalance as { balance: number }).balance,
          pool_utilization: BigNumber(remainingPool)
            .div(totalSupply)
            .toFixed(8),
          withdraw_available: supplyAndProfit.lte(remainingPool)
            ? supplyAndProfit.toFixed()
            : remainingPool.toString(),
        });
      }

      const data = {
        address: address,
        supplies: supplies,
        total_supply: totalSupplyInUsd.toFixed(),
        net_apy:
          supplies.length == 0 ? null : netApy.div(supplies.length).toFixed(8),
        total_earned: totalEarned.toFixed(),
      };

      this.cacheManager.store.set(key, data, ConfigService.Cache.ttl);

      return data;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async getAllLoan(
    address: string,
    chainId: number,
    offset: number,
    limit: number,
  ) {
    try {
      const key = `getAllLoan_${address}_${chainId}`;
      const cacheData = await this.cacheManager.get(key);
      if (cacheData) {
        this.logger.log(`\n:return:cache:${key}`);
        return {
          ...(cacheData as any),
          loans: {
            total: (cacheData as { loans: Array<any> }).loans.length,
            offset,
            limit,
            data: (cacheData as { loans: Array<any> }).loans.slice(
              offset,
              offset + limit,
            ),
          },
        };
      }

      const [yieldBorrower, network, ccfl] = await Promise.all([
        this.settingRepository.findOneBy({
          key: 'YIELD_BORROWER',
        }),
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

        const yieldEarned = null;
        let healthFactor = null;
        if (!loanInfo.isClosed && !loanInfo.isLiquidated) {
          // [yieldEarned, healthFactor] = await Promise.all([
          //   contractLoan.getYieldEarned(100 * parseInt(yieldBorrower.value)),
          //   contractCCFL.getHealthFactor(loanId),
          // ]);

          // yieldEarned = await contractLoan.getYieldEarned(100 * parseInt(yieldBorrower.value));

          healthFactor = await contractCCFL.getHealthFactor(loanId);
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
          loan_id: parseInt(loanId),
          is_fiat: loanInfo.isFiat,
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
          is_finally: loanInfo.isFinalty,
          debt_remain: debtRemain.toString(),
          collateral_amount: collateralAmount.toString(),
          collateral_asset: collateral.symbol,
          collateral_decimals: collateral.decimals,
          collateral_price: collateral.price,
          yield_generating: isYieldGenerating,
          yield_earned: yieldEarned == null ? null : yieldEarned.toString(),
        });

        allLoans.sort((a, b) => parseInt(b.loan_id) - parseInt(a.loan_id));
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

      return {
        ...data,
        loans: {
          total: allLoans.length,
          offset,
          limit,
          data: data.loans.slice(offset, offset + limit),
        },
      };
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async sendSubscribeEmail(email: string) {
    try {
      let result = null;

      const existSubscriber = await this.subscriberRepository.findOneBy({
        email,
      });

      if (existSubscriber) {
        if (existSubscriber.isSubscribed) {
          throw new HttpException(
            this.i18n.translate('message.EMAIL_ALREADY_SUBSCRIBED', {
              lang: I18nContext.current().lang,
            }),
            HttpStatus.BAD_REQUEST,
          );
        } else {
          await this.subscriberRepository.update(
            { email },
            {
              lastSubscribedAt: new Date(),
              numSubscribed: existSubscriber.numSubscribed + 1,
              isSubscribed: true,
            },
          );

          result = await this.subscriberRepository.findOneBy({ email });
        }
      } else {
        const subscriber = new Subscriber();
        subscriber.email = email;
        subscriber.firstSubscribedAt = new Date();
        subscriber.numSubscribed = 1;
        subscriber.isSubscribed = true;

        result = await this.subscriberRepository.save(subscriber);
      }

      const token = this.jwtService.sign(
        { email },
        {
          secret: ConfigService.JWTConfig.secret,
        },
      );

      const linkUnsubscribe = `${ConfigService.App.domain}/user/confirm-unsubscribe?token=${token}`;

      await this.emailService.sendMail({
        to: email,
        subject: 'Your new subscription on FUSIONFI application',
        template: './new-subscribe',
        context: {
          linkUnsubscribe,
        },
      });

      return result;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async unsubscribe(token: string) {
    try {
      const { email } = this.jwtService.verify(token, {
        secret: ConfigService.JWTConfig.secret,
      });

      const existSubscriber = await this.subscriberRepository.findOneBy({
        email,
      });

      if (existSubscriber) {
        if (!existSubscriber.isSubscribed) {
          throw new HttpException(
            this.i18n.translate('message.EMAIL_ALREADY_UNSUBSCRIBED', {
              lang: I18nContext.current().lang,
            }),
            HttpStatus.BAD_REQUEST,
          );
        } else {
          if (existSubscriber.numUnsubscribed == 0) {
            await this.subscriberRepository.update(
              { email },
              {
                firstUnsubscribedAt: new Date(),
                numUnsubscribed: existSubscriber.numUnsubscribed + 1,
                isSubscribed: false,
              },
            );
          } else {
            await this.subscriberRepository.update(
              { email },
              {
                lastUnsubscribedAt: new Date(),
                numUnsubscribed: existSubscriber.numUnsubscribed + 1,
                isSubscribed: false,
              },
            );
          }

          const updated = await this.subscriberRepository.findOneBy({ email });
          return updated;
        }
      } else {
        throw new HttpException(
          this.i18n.translate('message.EMAIL_NOT_FOUND', {
            lang: I18nContext.current().lang,
          }),
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async getAllSubscribers() {
    try {
      const result = [];
      const all = await this.subscriberRepository.findBy({
        isSubscribed: true,
      });
      for (const item of all) {
        result.push(item.email);
      }
      return result;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
