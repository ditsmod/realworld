import type { UserSession } from './users.dto.js';

export interface EmailOrUsername {
  email?: string;
  username?: string;
}

export type DbUser = Omit<UserSession, 'token'> & { userId: number };
