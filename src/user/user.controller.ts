import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  HttpException,
  Render,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { EmailDto } from './dto/email.dto';
import { RestorePasswordDto } from './dto/restore-password.dto';
import { UserResponse } from './interface/user.interface';
import { User } from './entity/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post('signup')
  async signUp(@Body() signupDto: SignUpDto) {
    try {
      const userData = new User();
      userData.username = signupDto.username;
      userData.password = signupDto.password;
      userData.firstName = signupDto.firstName;
      userData.lastName = signupDto.lastName;
      userData.email = signupDto.email;

      const newUser = await this.userService.signUp(userData);

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

  @Public()
  @Post('signin')
  signIn(@Body() signinDto: SignInDto) {
    try {
      return this.userService.signIn(signinDto.username, signinDto.password);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiExcludeEndpoint()
  @Get('verify-email')
  @Render('confirm-email')
  verifyEmail(@Query('token') token: string) {
    try {
      return this.userService.verifyEmail(token);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @Post('forgot-password')
  sendForgotPasswordLink(@Body() { email }: EmailDto) {
    try {
      return this.userService.sendForgotPasswordLink(email);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiExcludeEndpoint()
  @Get('restore-password')
  @Render('restore-password')
  renderRestorePassword(@Query('token') token: string) {
    return { token };
  }

  @Public()
  @ApiExcludeEndpoint()
  @Post('change-password')
  changePassword(@Body() { token, password }: RestorePasswordDto) {
    try {
      return this.userService.changePassword(token, password);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Get('all')
  async findAll(): Promise<UserResponse[]> {
    try {
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
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
