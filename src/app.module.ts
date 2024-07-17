import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { DbModule } from './db/db.module';
import { SeederModule } from './seeder/seeder.module';
import { MessageModule } from './message/message.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { RoleModule } from './role/role.module';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { SubgraphModule } from './subgraph/subgraph.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './task/task.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';

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
    MessageModule,
    ConfigModule,
    RoleModule,
    SubgraphModule,
    // ScheduleModule.forRoot(),
    // TaskModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
