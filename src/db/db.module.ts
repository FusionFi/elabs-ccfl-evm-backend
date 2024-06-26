import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from 'src/config/config.service';
import { DataSourceOptions } from 'typeorm';
import 'dotenv/config';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: ConfigService.DBConfig.host,
  port: ConfigService.DBConfig.port,
  username: ConfigService.DBConfig.username,
  password: ConfigService.DBConfig.password,
  database: ConfigService.DBConfig.database,
  synchronize: ConfigService.DBConfig.synchronize,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
};

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions)],
})
export class DbModule {}
