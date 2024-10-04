import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from 'src/config/config.service';
import axios from 'axios';
import { Setting } from 'src/setting/entity/setting.entity';

@Injectable()
export class EncryptusService {
  private readonly logger = new Logger(EncryptusService.name);

  constructor(
    @InjectRepository(Setting)
    private settingRepository: Repository<Setting>,
  ) {}

  async createUser(email: string) {
    try {
      const token = await this.settingRepository.findOneBy({
        key: 'ENCRYPTUS_TOKEN',
      });

      const data = JSON.stringify({
        email: email,
      });

      const config = {
        method: 'POST',
        url: `${ConfigService.Encryptus.url}/v1/partners/create/user`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
        data: data,
      };

      const result = await axios(config);
      return result.data;
    } catch (error) {
      if (error?.response) {
        throw new HttpException(
          error?.response?.data?.message,
          error?.response?.status,
        );
      } else {
        throw new HttpException(error?.response, error?.status);
      }
    }
  }

  async generateKYCLink() {
    try {
      const token = await this.settingRepository.findOneBy({
        key: 'ENCRYPTUS_TOKEN',
      });

      const config = {
        method: 'GET',
        url: `${ConfigService.Encryptus.url}/v1/partners/kycurl?accountType=Individual`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      };

      const result = await axios(config);
      return result.data;
    } catch (error) {
      console.log('error: ', error);
      if (error?.response) {
        throw new HttpException(
          error?.response?.data?.message,
          error?.response?.status,
        );
      } else {
        throw new HttpException(error?.response, error?.status);
      }
    }
  }
}
