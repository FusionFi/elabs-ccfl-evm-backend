import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { MessageService } from 'src/message/message.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private jwtService: JwtService,

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
