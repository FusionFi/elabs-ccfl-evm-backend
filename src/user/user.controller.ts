import {
  Body,
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { UserResponse } from './user.response';
import { User } from './user.entity';
import { AuthGuard, Public } from '../auth/auth.guard';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';

// @ApiBearerAuth()
@Controller({
  version: '1',
})
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post('create')
  async createUser(@Body() user: UserDto) {
    try {
      const userData = new User();
      userData.username = user.username;
      userData.password = user.password;
      userData.firstName = user.firstName;
      userData.lastName = user.lastName;
      userData.email = user.email;

      const newUser = await this.userService.create(userData);

      const userRes = new UserResponse();
      userRes.id = newUser.id;
      userRes.username = newUser.username;
      userRes.firstName = newUser.firstName;
      userRes.lastName = newUser.lastName;
      userRes.email = newUser.email;

      return userRes;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Get()
  async findAll(): Promise<UserResponse[]> {
    const users = await this.userService.findAll();
    const userRes: UserResponse[] = [];
    users.forEach((x) => {
      const user = new UserResponse();
      user.id = x.id;
      user.username = x.username;
      user.firstName = x.firstName;
      user.lastName = x.lastName;
      user.email = x.email;
      userRes.push(user);
    });
    return userRes;
  }
}
