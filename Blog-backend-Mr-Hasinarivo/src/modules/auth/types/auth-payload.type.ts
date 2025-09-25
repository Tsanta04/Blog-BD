import { UserRole } from '@prisma/client';
export interface AuthPayload {
  sub: string;
  email: string;
  role: UserRole;
  professionalType?: string | null;
}
