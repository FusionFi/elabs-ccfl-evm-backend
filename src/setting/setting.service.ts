import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Setting } from './entity/setting.entity';
import { SettingDto } from './dto/setting.dto';

@Injectable()
export class SettingService {
  private readonly logger = new Logger(SettingService.name);

  constructor(
    @InjectRepository(Setting)
    private settingRepository: Repository<Setting>,
  ) {}

  async createSetting(settingDto: SettingDto) {
    try {
      return await this.settingRepository.save({
        key: settingDto.key,
        value: settingDto.value,
        type: settingDto.type,
        isActive: settingDto.isActive,
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async findAllSetting(key?: string) {
    try {
      const searchObj: any = {
        isActive: true,
      };

      if (key) {
        searchObj.key = ILike(`%${key}%`);
      }

      return await this.settingRepository.findBy(searchObj);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async findSetting(id: string) {
    try {
      return await this.settingRepository.findOneBy({ id });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async updateSetting(id: string, settingDto: SettingDto) {
    try {
      await this.settingRepository.update(id, {
        key: settingDto.key,
        value: settingDto.value,
        type: settingDto.type,
        isActive: settingDto.isActive,
      });
      return await this.settingRepository.findOneBy({ id });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }

  async removeSetting(id: string) {
    try {
      await this.settingRepository.delete(id);
      return true;
    } catch (e) {
      this.logger.error(
        `[Setting]: Failed to remove setting, id: ${id}, error: ${e.message}`,
      );
      return false;
    }
  }
}
