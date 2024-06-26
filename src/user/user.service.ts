import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { MessageService } from 'src/message/message.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  async findOne(username: string) {
    const result: User = await this.userRepository.findOneBy({ username });
    return result;
  }

  async remove(id: string) {
    await this.userRepository.delete(id);
  }

  async create(user: User) {
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
}
