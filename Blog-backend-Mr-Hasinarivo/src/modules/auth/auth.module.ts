import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@/common/strategy/jwt.strategy';
import { AppConfigService } from '@/common/modules/config/config.service';
import { UserModule } from '@/modules/user/user.module';
import { SharedModule } from '@/common/modules/shared.module';

@Module({
  imports: [
    UserModule,
    SharedModule,
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        secret: config.jwtSecret,
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    AppConfigService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
