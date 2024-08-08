import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RouterModule, APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { DbModule } from './db/db.module';
import { SeederModule } from './seeder/seeder.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { RoleModule } from './role/role.module';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { SubgraphModule } from './subgraph/subgraph.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './task/task.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { EventModule } from './event/event.module';
import { AdminModule } from './admin/admin.module';
import {
  I18nModule,
  AcceptLanguageResolver,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import * as path from 'path';

console.log('path: ', path.join(__dirname, '/message/'));

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: ConfigService.App.ttl,
        limit: ConfigService.App.limit,
      },
    ]),
    UserModule,
    AuthModule,
    DbModule,
    SeederModule,
    ConfigModule,
    RoleModule,
    SubgraphModule,
    ScheduleModule.forRoot(),
    TaskModule,
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
    EventModule,
    AdminModule,
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
