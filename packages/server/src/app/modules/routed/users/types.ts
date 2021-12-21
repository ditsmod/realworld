import { UserSession } from './models';

export interface EmailOrUsername {
  email?: string;
  username?: string;
}


export type DbUser = (Omit<UserSession, 'token'> & {user_id: number});