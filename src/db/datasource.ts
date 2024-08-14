import { DataSource } from 'typeorm';
import { join } from 'path';
import { ConfigService } from 'src/config/config.service';
import 'dotenv/config';

export const connectionSource = new DataSource({
  type: 'postgres',
  host: ConfigService.DBConfig.host,
  port: ConfigService.DBConfig.port,
  username: ConfigService.DBConfig.username,
  password: ConfigService.DBConfig.password,
  database: ConfigService.DBConfig.database,
  synchronize: ConfigService.DBConfig.synchronize,
  logging: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [join(__dirname, '/migrations/**/*{.ts,.js}')],
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: true,
});
