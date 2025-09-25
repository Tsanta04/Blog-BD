import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { UserRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.warn('Access denied: No user found in request');
      throw new ForbiddenException('Access denied: No user found in request');
    }

    const hasAccess = requiredRoles.includes(user.role);

    if (!hasAccess) {
      this.logger.warn(
        `Access denied: user role '${user.role}' is not in [${requiredRoles.join(', ')}]`,
      );
      throw new ForbiddenException(
        `Access denied: You need one of the roles [${requiredRoles.join(', ')}]`,
      );
    }

    return true;
  }
}
