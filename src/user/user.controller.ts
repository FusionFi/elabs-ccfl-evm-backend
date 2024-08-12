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
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { EmailDto } from './dto/email.dto';
import { RestorePasswordDto } from './dto/restore-password.dto';
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
  async findAllUser() {
    try {
      const allUsers = await this.userService.findAllUser();
      return mapUser(allUsers);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Get all user\'s supplies' })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  @Get(':address/supply')
  async findAllSupply(@Param('address') address: string) {
    try {
      const fakeData = {
        address: address,
        supplies: [
          {
            asset: "USDC",
            supply_balance: "3500",
            earned_reward: "350",
            apy: "0.01",
            wallet_balance: "1000",
            pool_utilization: "90",
            withdraw_available: "3500"
          },
          {
            asset: "USDT",
            supply_balance: "3500",
            earned_reward: "350",
            apy: "0.01",
            wallet_balance: "1000",
            pool_utilization: "90",
            withdraw_available: "3500"
          }
        ],
        total_supply: "4567.87",
        net_apy: "0.07",
        total_earned: "65.87"
      };
      return fakeData;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Get all user\'s loans' })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  @Get(':address/loan')
  async findAllLoan(@Param('address') address: string) {
    try {
      const fakeData = {
        address: address,
        loans: [
          {
            asset: "USDC",
            loan_size: "3000",
            apr: "1.82",
            health: "12.76",
            status: "active",
            debt_remain: "2780",
            collateral_amount: "2.5",
            collateral_asset: "WETH",
            yield_generating: true,
            yield_earned: "0.281"
          }
        ],
        total_loan: "1875.00",
        total_collateral: "1875.00",
        net_apr: "0.07",
        finance_health: "1.66"
      };
      return fakeData;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Public()
  @ApiOperation({ summary: 'Get all user\'s balance' })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  @Get(':address/balance')
  async findAllBalance(@Param('address') address: string) {
    try {
      const fakeData = {
        address: address,
        balance: [
          {
            asset: "USDC",
            amount: "1000"
          },
          {
            asset: "USDT",
            amount: "1000"
          },
          {
            asset: "ETH",
            amount: "1"
          },
          {
            asset: "WBTC",
            amount: "1"
          }
        ]
      };
      return fakeData;
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
