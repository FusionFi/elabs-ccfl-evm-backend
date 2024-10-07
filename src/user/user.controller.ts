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
  Param,
  Redirect,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiTags,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignInEmailDto } from './dto/sign-in-email.dto';
import { EmailDto } from './dto/email.dto';
import { UsernameDto } from './dto/username.dto';
import { RestorePasswordDto } from './dto/restore-password.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';
import { mapUser } from './response-dto/user.map';
import { mapSubscriber } from './response-dto/subscriber.map';
import { IntDefaultValuePipe } from 'src/common/pipes/int-default-value.pipe';

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
  @ApiOperation({ summary: 'Sign in' })
  @Post('signin')
  signIn(@Body() signinDto: SignInDto) {
    try {
      return this.userService.signIn(signinDto.username, signinDto.password);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Sign in with email' })
  @Post('signin/email')
  signInWithEmail(@Body() signinEmailDto: SignInEmailDto) {
    try {
      return this.userService.signInWithEmail(
        signinEmailDto.email,
        signinEmailDto.password,
      );
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiExcludeEndpoint()
  @Get('verify-email')
  @Redirect()
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
  @ApiOperation({ summary: 'Change current password' })
  @Post('change-password')
  changePassword(@Body() { token, password }: RestorePasswordDto) {
    try {
      return this.userService.changePassword(token, password);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Check existing username' })
  @Post('check/username')
  checkExistingUsername(@Body() { username }: UsernameDto) {
    try {
      return this.userService.checkExistingUsername(username);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Check existing email' })
  @Post('check/email')
  checkExistingEmail(@Body() { email }: EmailDto) {
    try {
      return this.userService.checkExistingEmail(email);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiOperation({ summary: 'Check old password' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('check/old-password')
  checkOldPassword(@Body() signinDto: SignInDto) {
    try {
      return this.userService.checkOldPassword(
        signinDto.username,
        signinDto.password,
      );
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    try {
      return await this.userService.getProfile(req.user);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Get('all')
  async findAllUser() {
    try {
      const allUsers = await this.userService.findAllUser();
      return mapUser(allUsers);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: "Get all user's supplies" })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  @Get(':address/:chainId/supply')
  async getAllSupply(
    @Param('address') address: string,
    @Param('chainId') chainId: number,
  ) {
    try {
      const allSupply = await this.userService.getAllSupply(address, chainId);
      return allSupply;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: "Get all user's loans" })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  @ApiQuery({
    name: 'offset',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
  })
  @Get(':address/:chainId/loan')
  async getAllLoan(
    @Param('address') address: string,
    @Param('chainId') chainId: number,
    @Query('offset', new IntDefaultValuePipe(0)) offset: number,
    @Query('limit', new IntDefaultValuePipe(10)) limit: number,
  ) {
    try {
      const allLoan = await this.userService.getAllLoan(
        address,
        chainId,
        offset,
        limit,
      );
      return allLoan;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: "Get all user's balance" })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  @Get(':address/:chainId/:asset/balance')
  async getBalance(
    @Param('address') address: string,
    @Param('chainId') chainId: number,
    @Param('asset') asset: string,
  ) {
    try {
      const addressBalance = await this.userService.getBalance(
        address,
        chainId,
        asset,
      );
      return addressBalance;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Subscribe' })
  @Post('subscribe')
  async sendSubscribeEmail(@Body() { email }: EmailDto) {
    try {
      const result = await this.userService.sendSubscribeEmail(email);
      return mapSubscriber(result);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiExcludeEndpoint()
  @Get('confirm-unsubscribe')
  @Render('confirm-unsubscribe')
  renderConfirmUnsubscribe(@Query('token') token: string) {
    try {
      return this.userService.unsubscribe(token);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Get all subscribers' })
  @Get('subscribe/all')
  async getAllSubscribers() {
    try {
      const result = await this.userService.getAllSubscribers();
      return result;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
