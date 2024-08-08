import { Injectable } from '@nestjs/common';
import { I18nService, I18nContext } from 'nestjs-i18n';

@Injectable()
export class AppService {
  constructor(private readonly i18n: I18nService) {}

  getHello(): string {
    return this.i18n.translate('message.WELCOME', {
      lang: I18nContext.current().lang,
    });
  }
}
