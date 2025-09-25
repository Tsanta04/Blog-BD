import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get env(): string {
    return (
      this.configService.get<string>('env', {
        infer: true,
      }) ?? ' '
    );
  }
  get port(): number {
    return this.configService.get<number>('port', {
      infer: true,
    });
  }
  get frontUrl(): string {
    return (
      this.configService.get<string>('frontUrl', {
        infer: true,
      }) ?? ' '
    );
  }

  get jwtSecret(): string {
    return (
      this.configService.get<string>('jwtSecret', {
        infer: true,
      }) ?? ' '
    );
  }

  get googleClientIdAndroid(): string {
    return (
      this.configService.get<string>('googleClientIdAndroid', {
        infer: true,
      }) ?? ' '
    );
  }
  get googleClientIdSecret(): string {
    return (
      this.configService.get<string>('googleClientIdSecret', {
        infer: true,
      }) ?? ' '
    );
  }
  get googleUserEmail(): string {
    return (
      this.configService.get<string>('googleUserEmail', {
        infer: true,
      }) ?? ' '
    );
  }

  get refreshToken(): string {
    return (
      this.configService.get<string>('refreshToken', {
        infer: true,
      }) ?? ' '
    );
  }
  get stripeSecretKey(): string {
    return (
      this.configService.get<string>('stripeSecretKey', {
        infer: true,
      }) ?? ' '
    );
  }
  get stripeWebhookSecret(): string {
    return (
      this.configService.get<string>('stripeWebhookSecret', {
        infer: true,
      }) ?? ' '
    );
  }

  get auth0ClientId(): string {
    return (
      this.configService.get<string>('auth0ClientId', {
        infer: true,
      }) ?? ' '
    );
  }

  get auth0Domain(): string {
    return (
      this.configService.get<string>('auth0Domain', {
        infer: true,
      }) ?? ' '
    );
  }

  get auth0Audience(): string {
    return (
      this.configService.get<string>('auth0Audience', {
        infer: true,
      }) ?? ' '
    );
  }
}
