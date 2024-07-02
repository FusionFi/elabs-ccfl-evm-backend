import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { MessageService } from 'src/message/message.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from 'src/config/config.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private jwtService: JwtService,
    private readonly emailService: MailerService,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signUp(user: User) {
    try {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(user.password, salt);
      user.isActive = true;

      const existUser = await this.userRepository.findOneBy({
        username: user.username,
      });
      if (existUser) {
        this.logger.error(MessageService.USERNAME_ALREADY_USED);
        throw new HttpException(
          MessageService.USERNAME_ALREADY_USED,
          HttpStatus.BAD_REQUEST,
        );
      }

      const email = user.email;

      const token = this.jwtService.sign(
        { email },
        {
          secret: ConfigService.JWTConfig.secret,
          expiresIn: '86400s'
        }
      );

      console.log('token: ', token);

      const link = `http://127.0.0.1:3000/user/verify-email?token=${token}`;
      console.log('link: ', link);

      console.log('before send mail');
      await this.emailService.sendMail({
        to: user.email,
        subject: `Welcome to the CCFL application`,
        template: './confirmation',
        context: {
          username: user.username,
          link,
        } 
      });
      console.log('after send mail');

      return await this.userRepository.save(user);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async signIn(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ username });
    if (user?.emailVerified == false) {
      throw new UnauthorizedException(MessageService.EMAIL_NOT_VERIFIED);
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
  }

  async verifyEmail(token: string) {
    const { email } = this.jwtService.verify(token, {
      secret: ConfigService.JWTConfig.secret
    });

    if (email == null || email == undefined) {
      throw new BadRequestException('Invalid token payload');
    }

    const user = await this.userRepository.findOneBy({
      email
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.userRepository.update(
      { email },
      {
        emailVerified: true,
      }
    );

    return {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      emailVerified: true,
      isActive: user.isActive
    }
  }

  async findOne(username: string) {
    const result: User = await this.userRepository.findOneBy({ username });
    return result;
  }

  findAll() {
    return this.userRepository.find();
  }

  async remove(id: string) {
    await this.userRepository.delete(id);
  }
}
