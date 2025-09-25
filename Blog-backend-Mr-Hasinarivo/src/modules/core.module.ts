import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from './email/email.module';

import { AppConfigService } from '@/common/modules/config/config.service';
import { AppConfigModule } from '@/common/modules/config/config.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
@Global()
@Module({
  imports: [
    AppConfigModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        secret: configService.jwtSecret,
        signOptions: { expiresIn: '24h' },
        global: true,
      }),
    }),
    AuthModule,
    UserModule,
    EmailModule,
  ],
  providers: [],
  exports: [JwtModule],
})
export class CoreModule {}
