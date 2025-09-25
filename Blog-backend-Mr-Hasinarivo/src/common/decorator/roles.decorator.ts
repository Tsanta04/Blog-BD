import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';
export const ROLES_KEY = 'roles';

export const Roles = (roles: UserRole[] = []) => {
  return (target: any, key?: any, descriptor?: any) => {
    SetMetadata(ROLES_KEY, roles)(target, key, descriptor);
  };
};
