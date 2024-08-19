import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entity/user.entity';
import { Network } from 'src/network/entity/network.entity';
import { Asset } from 'src/asset/entity/asset.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from 'src/config/config.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import {
  I18nModule,
  AcceptLanguageResolver,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Network, Asset]),
    JwtModule.register({
      global: true,
      secret: ConfigService.JWTConfig.secret,
      signOptions: { expiresIn: ConfigService.JWTConfig.expire },
    }),
    MailerModule.forRoot({
      transport: {
        host: ConfigService.Mail.host,
        port: ConfigService.Mail.port,
        secure: false,
        auth: {
          user: ConfigService.Mail.user,
          pass: ConfigService.Mail.password,
        },
      },
      template: {
        dir: join(process.cwd(), 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '../message/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
