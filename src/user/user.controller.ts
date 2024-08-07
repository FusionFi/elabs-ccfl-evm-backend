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
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags, ApiOperation } from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { EmailDto } from './dto/email.dto';
import { RestorePasswordDto } from './dto/restore-password.dto';
import { User } from './entity/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';
import { mapUser } from './response-dto/user.map';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @ApiOperation({ summary: 'Sign up for new user' })
  @Post('signup')
  async signUp(@Body() signupDto: SignUpDto) {
    try {
      const newUser = await this.userService.signUp(signupDto);
      return mapUser(newUser);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Sign in'})
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
  @ApiOperation({ summary: 'Forgot password' })
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

  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Get('all')
  async findAll() {
    try {
      const allUsers = await this.userService.findAll();
      return mapUser(allUsers);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
