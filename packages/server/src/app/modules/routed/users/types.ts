import type { UserSessionDto } from './users.dto.js';

export interface EmailOrUsername {
  email?: string;
  username?: string;
}

export interface DbUser extends Omit<UserSessionDto, 'token'> {
  userId: number;
}
