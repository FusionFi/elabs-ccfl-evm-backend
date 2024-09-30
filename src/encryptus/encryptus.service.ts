import { Injectable, HttpException, Logger } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import axios from 'axios';

@Injectable()
export class EncryptusService {
  private readonly logger = new Logger(EncryptusService.name);

  constructor() {}

  async generateToken() {
    try {
      const token = await axios.post(
        `${ConfigService.Encryptus.url}/v1/partners/generate/token`,
        {
          partnerEmail: ConfigService.Encryptus.partner_email,
          partnerPassword: ConfigService.Encryptus.partner_password,
          grant_services: ['FORENSICS', 'QUOTESANDORDERS'],
          clientID: ConfigService.Encryptus.client_id,
          clientSecret: ConfigService.Encryptus.client_secret,
        },
      );
      return {
        access_token: token.data.access_token,
      };
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
