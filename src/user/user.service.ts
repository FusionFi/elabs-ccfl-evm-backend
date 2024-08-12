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
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from 'src/config/config.service';
import * as bcrypt from 'bcrypt';
import { I18nService, I18nContext } from 'nestjs-i18n';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private jwtService: JwtService,
    private readonly emailService: MailerService,

    @InjectRepository(User)
    private userRepository: Repository<User>,

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
}
