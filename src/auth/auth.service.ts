import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { MessageService } from 'src/message/message.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
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
      role: user.role
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
