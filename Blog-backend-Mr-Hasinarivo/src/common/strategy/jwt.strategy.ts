import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from '../modules/config/config.service';
import { AuthPayload } from '@/modules/auth/types/auth-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  validate(payload: AuthPayload) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      professionalType: payload.professionalType || null,
    };
  }
}
