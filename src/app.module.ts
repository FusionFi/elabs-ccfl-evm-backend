import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RouterModule } from '@nestjs/core';
// import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { DbModule } from './db/db.module';
import { SeederModule } from './seeder/seeder.module';
import { MessageModule } from './message/message.module';
import { ConfigModule } from './config/config.module';
// import { RoleModule } from './role/role.module';
import { LoggerMiddleware } from 'src/middleware/logger.middleware';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 6000,
        limit: 10,
      },
    ]),
    UserModule,
    // RouterModule.register([
    //   {
    //     path: 'user',
    //     module: UserModule,
    //   },
    // ]),
    // AuthModule,
    DbModule,
    SeederModule,
    MessageModule,
    ConfigModule,
    // RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
