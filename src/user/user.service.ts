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

    const network = await this.networkRepository.findOneBy({
      isActive: true,
      chainId,
    });

    if (!network) {
      return {
        address,
        balance,
      };
    }

    const provider = new ethers.JsonRpcProvider(network.rpcUrl);

    if (asset.toUpperCase() == 'ETH') {
      const ethBalance = await provider.getBalance(address);
      balance = ethBalance.toString();
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
        };
      }

      const contract = new ethers.Contract(token.address, abi, provider);
      const tokenBalance = await contract.balanceOf(address);
      balance = tokenBalance.toString();
    }

    return {
      address,
      balance,
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
      type: ILike(`%pool%`),
      chainId: chainId,
    });

    const provider = new ethers.JsonRpcProvider(network.rpcUrl);

    let supplies = [];
    let apr = BigNumber(0);
    for (const item of allPools) {
      const contract = new ethers.Contract(item.address, abiCCFLPool, provider);
      const supplyBalance = await contract.balance(address);

      const currentRate = await contract.getCurrentRate();
      // console.log('currentRate: ', currentRate);
      apr = BigNumber(currentRate[1]).div(1e27);
      // console.log('apr: ', apr.toFixed());
      // apy = (BigNumber(1).plus(apr.div(31536000))).pow(31536000).minus(1); 

      const walletBalance = await this.getBalance(address, chainId, item.asset);

      const remainingPool = await contract.getRemainingPool();
      const totalSupply = await contract.getTotalSupply();

      supplies.push({
        asset: item.asset,
        supply_balance: supplyBalance.toString(),
        earned_reward: null,
        apy: apr.toFixed(),
        wallet_balance: walletBalance.balance,
        pool_utilization: BigNumber(remainingPool).div(totalSupply).toFixed(),
        withdraw_available: null,
      });
    }

    return {
      address,
      supplies,
      // total_supply: null,
      net_apy: apr.toFixed(),
      // total_earned: null
    };    
  }
}
