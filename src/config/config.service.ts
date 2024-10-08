import { Injectable } from '@nestjs/common';
import 'dotenv/config';

@Injectable()
export class ConfigService {
  constructor() {}

  static DBConfig = {
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME || 'postgres',
    synchronize: process.env.DATABASE_SYNC == '1',
  };

  static JWTConfig = {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '1h',
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    refresh_expire: process.env.JWT_REFRESH_EXPIRE || '7d',
  };

  static EncryptConfig = {
    key: process.env.ENCRYPT_KEY,
  };

  static Logger = {
    folder: process.env.LOG_FOLDER || 'logs',
  };

  static App = {
    domain: process.env.APP_DOMAIN,
    port: parseInt(process.env.APP_PORT || '3000'),
    ttl: parseInt(process.env.TTL || '10000'),
    limit: parseInt(process.env.LIMIT || '10'),
    seconds_per_year: parseInt(process.env.SECONDS_PER_YEAR || '31536000'),
    frontend_url: process.env.FRONTEND_URL,
  };

  static Cors = {
    origin: process.env.CORS_ORIGIN || '*',
  };

  static Admin = {
    password: process.env.ADMIN_PASSWORD,
  };

  static Mail = {
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT || '587'),
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
  };

  static Subgraph = {
    url: process.env.SUBGRAPH_URL,
  };

  static Redis = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    dbNum: parseInt(process.env.REDIS_DB_NUM || '1'),
  };

  static Cache = {
    ttl: parseInt(process.env.CACHE_TTL || '60000'),
  };

  static Rpc = {
    url: process.env.RPC_URL,
    key: process.env.RPC_KEY,
  };

  static Coingecko = {
    url: process.env.COINGECKO_URL,
  };

  static Telegram = {
    groupId: process.env.TELEGRAM_GROUP_ID,
    token: process.env.TELEGRAM_TOKEN,
  };

  static Cronjob = {
    updateCryptoPrice: process.env.CRONJOB_UPDATE_CRYPTO_PRICE,
    updateFiatPrice: process.env.CRONJOB_UPDATE_FIAT_PRICE,
    checkLiquidation: process.env.CRONJOB_CHECK_LIQUIDATION,
    operatorPrivateKey: process.env.OPERATOR_PRIVATE_KEY,
    updateEncryptusToken: process.env.CRONJOB_UPDATE_ENCRYPTUS_TOKEN,
  };

  static FiatPrice = {
    url_1: process.env.URL_UPDATE_FIAT_PRICE_1,
    url_2: process.env.URL_UPDATE_FIAT_PRICE_2,
  };

  static Encryptus = {
    url: process.env.URL_ENCRYPTUS,
    partner_email: process.env.PARTNER_EMAIL,
    partner_password: process.env.PARTNER_PASSWORD,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  };
}
