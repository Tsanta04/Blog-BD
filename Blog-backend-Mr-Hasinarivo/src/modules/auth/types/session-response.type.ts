import { User, FoodTruckType } from '@prisma/client';
export interface Token {
  auth_token: string;
  refresh_token: string;
}
export type SafeUser = Omit<User, 'password'> & {
  seller_id?: number | null;
  seller_type?: FoodTruckType | null;
};
export interface SessionResponse {
  token: Token;
  user: SafeUser;
}
