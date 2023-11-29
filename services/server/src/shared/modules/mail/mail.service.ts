import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

import { Account } from '@/shared/modules/accounts';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private host: string;

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.host = configService.get('SERVICE_HOST');
  }

  async sendMail(sendMailOptions: ISendMailOptions) {
    await this.mailerService.sendMail(sendMailOptions);
  }

  async sendEmailVerificationMail(account: Account, link: string) {
    await this.sendMail({
      to: account.email,
      subject: `Подтвердите регистрацию на ${this.host}`,
      template: './email-verification-request',
      context: {
        account,
        link,
      },
    });
  }

  async sendPasswordResetMail(
    account: Account,
    link: string,
    loginLink: string,
  ) {
    await this.sendMail({
      to: account.email,
      subject: `Сброс пароля ${account.email} на ${this.host}`,
      template: './password-reset-request',
      context: {
        account,
        link,
        loginLink,
      },
    });
  }

  async sendEmailUpdateMail(source: string, destination: string, link: string) {
    await this.sendMail({
      to: destination,
      subject: `Подтвердите смену эл. почты на ${this.host}`,
      template: './email-update',
      context: {
        source,
        destination,
        link,
      },
    });
  }
}
