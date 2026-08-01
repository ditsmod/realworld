import type { UserSessionItemDto } from './users.dto.js';

export interface EmailOrUsername {
  email?: string;
  username?: string;
}

export interface DbUser extends Omit<UserSessionItemDto, 'token'> {
  userId: number;
}
