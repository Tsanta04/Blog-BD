import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redis: Redis,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('Authorization header missing');

    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (!token) throw new UnauthorizedException('Token missing');

    // --- Vérification Redis (optionnel si tu stockes le token pour logout)
    const userId = await this.redis.get(`session:token:${token}`);
    if (!userId) throw new UnauthorizedException('Invalid or expired token');
    
    try {
      // --- Vérification JWT (si tu utilises JWT réel)
      // const payload = this.jwtService.verify(token, {
      //   secret: this.config.get<string>('JWT_SECRET'),
      // });

      // Injecte l’ID de l’utilisateur dans req.user
      req['userId'] = userId;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
