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
    SubgraphModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
