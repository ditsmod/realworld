import { CustomError } from '@holu/core/errors';
import type { Injector } from '@holu/core';
import type { JwtService } from '@holu/jwt';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import type { DbService } from './db.service.js';
import type { SignUpFormDto, LoginFormDto } from './users.dto.js';
import { UserSessionDto, PutUserItemDto } from './users.dto.js';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  let usersService: UsersService;
  let dbServiceMock: any;
  let jwtServiceMock: any;
  let injectorMock: any;
  let dictServiceMock: any;

  beforeEach(() => {
    dbServiceMock = {
      signUpUser: vi.fn(),
      signInUser: vi.fn(),
      getCurrentUser: vi.fn(),
      putCurrentUser: vi.fn(),
    };

    jwtServiceMock = {
      signWithSecret: vi.fn().mockResolvedValue('fake-jwt-token'),
    };

    dictServiceMock = {
      getDictionary: vi.fn().mockReturnValue({
        badPasswordOrEmail: () => 'Bad password or email',
        youHaveObsoleteToken: () => 'Obsolete token',
      }),
    };

    injectorMock = {
      get: vi.fn().mockReturnValue(dictServiceMock),
    };

    usersService = new UsersService(
      dbServiceMock as unknown as DbService,
      jwtServiceMock as unknown as JwtService,
      injectorMock as unknown as Injector
    );
  });

  describe('signUpUser', () => {
    it('should register user, strip password, and return user session data with token', async () => {
      dbServiceMock.signUpUser.mockResolvedValue(123);
      const signUpFormData: SignUpFormDto = {
        user: {
          username: 'john',
          email: 'john@example.com',
          password: 'secretpassword',
        },
      };

      const result = await usersService.signUpUser(signUpFormData);

      expect(dbServiceMock.signUpUser).toHaveBeenCalledWith(signUpFormData);
      expect(signUpFormData.user.password).toBeUndefined();
      expect(jwtServiceMock.signWithSecret).toHaveBeenCalledWith({ userId: 123 });
      expect(result).toBeInstanceOf(UserSessionDto);
      expect(result.user.token).toBe('fake-jwt-token');
    });
  });

  describe('signInUser', () => {
    it('should return session data when credentials are correct', async () => {
      dbServiceMock.signInUser.mockResolvedValue({
        userId: 123,
        username: 'john',
        email: 'john@example.com',
        bio: 'bio text',
        image: 'http://image.png',
      });
      const loginFormData: LoginFormDto = {
        user: { email: 'john@example.com', password: 'secretpassword' },
      };

      const result = await usersService.signInUser(loginFormData);

      expect(dbServiceMock.signInUser).toHaveBeenCalledWith(loginFormData.user);
      expect(jwtServiceMock.signWithSecret).toHaveBeenCalledWith({ userId: 123 });
      expect(result.user.token).toBe('fake-jwt-token');
      expect(result.user.username).toBe('john');
    });

    it('should throw CustomError when user is not found', async () => {
      dbServiceMock.signInUser.mockResolvedValue(null);
      const loginFormData: LoginFormDto = {
        user: { email: 'wrong@example.com', password: 'wrong' },
      };

      await expect(usersService.signInUser(loginFormData)).rejects.toThrow(CustomError);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user with token when user exists', async () => {
      dbServiceMock.getCurrentUser.mockResolvedValue({
        username: 'john',
        email: 'john@example.com',
        bio: '',
        image: '',
      });

      const result = await usersService.getCurrentUser(123);

      expect(dbServiceMock.getCurrentUser).toHaveBeenCalledWith(123);
      expect(jwtServiceMock.signWithSecret).toHaveBeenCalledWith({ userId: 123 });
      expect(result.user.username).toBe('john');
      expect(result.user.token).toBe('fake-jwt-token');
    });

    it('should throw CustomError when user does not exist', async () => {
      dbServiceMock.getCurrentUser.mockResolvedValue(null);

      await expect(usersService.getCurrentUser(999)).rejects.toThrow(CustomError);
    });
  });

  describe('updateCurrentUser', () => {
    it('should update user and return current user data when affectedRows > 0', async () => {
      dbServiceMock.putCurrentUser.mockResolvedValue({ affectedRows: 1 });
      dbServiceMock.getCurrentUser.mockResolvedValue({
        username: 'updated',
        email: 'john@example.com',
      });

      const putUser: PutUserItemDto = { ...new PutUserItemDto(), username: 'updated' };
      const result = await usersService.updateCurrentUser(123, putUser);

      expect(dbServiceMock.putCurrentUser).toHaveBeenCalledWith(123, putUser);
      expect(result.user.username).toBe('updated');
    });

    it('should throw CustomError when affectedRows is 0', async () => {
      dbServiceMock.putCurrentUser.mockResolvedValue({ affectedRows: 0 });

      const putUser: PutUserItemDto = { ...new PutUserItemDto(), username: 'test' };
      await expect(usersService.updateCurrentUser(123, putUser)).rejects.toThrow(CustomError);
    });
  });
});
