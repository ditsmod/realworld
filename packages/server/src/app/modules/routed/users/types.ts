import { UserSession } from './models.js';

export interface EmailOrUsername {
  email?: string;
  username?: string;
}


export type DbUser = (Omit<UserSession, 'token'> & {userId: number});