import { DataSource } from 'typeorm';
import { join } from 'path';
import 'dotenv/config';

console.log('dir: ', join(__dirname, '/migrations/**/*{.ts,.js}'));

export const connectionSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.DATABASE_SYNC == '1',
  logging: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [join(__dirname, '/migrations/**/*{.ts,.js}')],
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: true,
});
