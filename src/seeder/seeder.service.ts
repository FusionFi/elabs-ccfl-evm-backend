import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { Role } from 'src/role/role.enum';
import { ConfigService } from 'src/config/config.service';
import 'dotenv/config';

@Injectable()
export class SeederService {
  constructor(private userService: UserService) {}

  async seed() {
    try {
      const users: User[] = [];
      const userData = new User();
      userData.firstName = 'admin';
      userData.lastName = 'admin';
      userData.username = 'admin';
      userData.password = ConfigService.Admin.password;
      userData.role = Role.Admin;
      userData.email = 'admin@gmail.com';
      userData.emailVerified = true;
      userData.isActive = true;
      users.push(await this.userService.signUp(userData));
      return users;
    } catch (e) {}
  }
}
