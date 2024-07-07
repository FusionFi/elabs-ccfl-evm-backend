import { Injectable } from '@nestjs/common';
import 'dotenv/config';

@Injectable()
export class ConfigService {
  constructor() {}

  static DBConfig = {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '3000'),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: process.env.DATABASE_SYNC == '1',
  };

  static JWTConfig = {
    secret: process.env.JWT_SECRET,
  };

  static EncryptConfig = {
    key: process.env.ENCRYPT_KEY,
  };

  static Logger = {
    folder: process.env.LOG_FOLDER,
  };

  static App = {
    port: process.env.APP_PORT,
  };

  static Cors = {
    origin: process.env.CORS_ORIGIN,
  };

  static Admin = {
    password: process.env.ADMIN_PASSWORD,
  };

  static Mail = {
    host: process.env.MAIL_HOST,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
  };
}
