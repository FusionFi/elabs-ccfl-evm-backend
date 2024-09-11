import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { DbModule } from './db/db.module';
import { SeederModule } from './seeder/seeder.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { RoleModule } from './role/role.module';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './task/task.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { EventModule } from './event/event.module';
import { SettingModule } from './setting/setting.module';
import { NetworkModule } from './network/network.module';
import { AssetModule } from './asset/asset.module';
import { UserModule } from './user/user.module';
import { ContractModule } from './contract/contract.module';
import { PoolModule } from './pool/pool.module';
import { SubgraphModule } from './subgraph/subgraph.module';
import { PriceModule } from './price/price.module';
import { FiatModule } from './fiat/fiat.module';
import { TelegrafModule } from 'nestjs-telegraf';
import {
  I18nModule,
  AcceptLanguageResolver,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: ConfigService.App.ttl,
        limit: ConfigService.App.limit,
      },
    ]),
    ConfigModule,
    DbModule,
    SeederModule,
    AuthModule,
    RoleModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async () => ({
        isGlobal: true,
        store: await redisStore({
          connectionName: 'ccfl-evm-api',
          host: ConfigService.Redis.host,
          port: ConfigService.Redis.port,
          username: ConfigService.Redis.username,
          password: ConfigService.Redis.password,
          db: ConfigService.Redis.dbNum,
        }),
      }),
      inject: [ConfigService],
    }),
    TelegrafModule.forRoot({
      token: ConfigService.Telegram.token,
    }),
    ScheduleModule.forRoot(),
    TaskModule,
    EventModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/message/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    UserModule,
    PoolModule,
    PriceModule,
    FiatModule,
    AssetModule,
    SubgraphModule,
    SettingModule,
    ContractModule,
    NetworkModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
