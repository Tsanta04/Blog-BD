import {
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/modules/user/user.service';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import {
  SessionResponse,
  Token,
} from './types/session-response.type';
import { AuthPayload } from './types/auth-payload.type';
import { AppConfigService } from '@/common/modules/config/config.service';

import jwksClient from 'jwks-rsa';
@Injectable()
export class AuthService {

  private jwks = jwksClient({
    jwksUri: `https://${this.config.auth0Domain}/.well-known/jwks.json`,
    cache: true,
    rateLimit: true,
  });

  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: AppConfigService,
  ) {

  }

  private generateSession(user: CreateUserDto & { id: string }): Token {
    const { id, email, role } = user;

    const payload: AuthPayload = {
      sub: id,
      email: email,
      role: role,
    };

    return {
      auth_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload),
    };
  }

  async signup(createUserDto: CreateUserDto): Promise<SessionResponse> {

  }

  async signin(email: string, password: string): Promise<SessionResponse> {

  }

  private async getSigningKey(kid: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.jwks.getSigningKey(kid, (err, key) => {
        if (err) return reject(err);
        const signingKey = key.getPublicKey();
        resolve(signingKey);
      });
    });
  }

}
