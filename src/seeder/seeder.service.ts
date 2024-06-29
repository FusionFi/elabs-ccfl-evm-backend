import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Role } from 'src/role/role.enum';
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
      userData.password = process.env.ADMIN_PASS;
      userData.role = Role.Admin;
      userData.email = 'admin@gmail.com';
      userData.isActive = true;
      users.push(await this.userService.create(userData));
      return users;
    } catch (e) {}
  }
}
