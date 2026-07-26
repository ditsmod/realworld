import { describe, it, expect, beforeEach, vi } from 'vitest';

import type { AuthService } from '#service/auth/auth.service.js';
import type { UtilService } from '#service/util/util.service.js';
import type { DbService } from './db.service.js';
import { ProfileData } from './profiles.dto.js';
import { ProfilesService } from './profiles.service.js';

describe('ProfilesService', () => {
  let profilesService: ProfilesService;
  let dbMock: any;
  let authServiceMock: any;
  let utilMock: any;

  beforeEach(() => {
    dbMock = {
      getProfile: vi.fn(),
      followUser: vi.fn(),
      unfollowUser: vi.fn(),
    };

    authServiceMock = {
      getCurrentUserId: vi.fn().mockResolvedValue(1),
    };

    utilMock = {
      throw404Error: vi.fn().mockImplementation((param, msg) => {
        throw new Error(`404: ${msg}`);
      }),
      convertToBool: vi.fn().mockImplementation((val) => Boolean(val)),
    };

    profilesService = new ProfilesService(
      dbMock as unknown as DbService,
      authServiceMock as unknown as AuthService,
      utilMock as unknown as UtilService
    );
  });

  describe('getProfileOfTargetUser', () => {
    it('should return ProfileData when profile exists', async () => {
      dbMock.getProfile.mockResolvedValue({
        username: 'celeb',
        bio: 'famous',
        image: 'img.jpg',
        following: 1,
      });

      const result = await profilesService.getProfileOfTargetUser('celeb', 1);

      expect(dbMock.getProfile).toHaveBeenCalledWith(1, 'celeb');
      expect(utilMock.convertToBool).toHaveBeenCalledWith(1);
      expect(result).toBeInstanceOf(ProfileData);
      expect(result.profile.username).toBe('celeb');
      expect(result.profile.following).toBe(true);
    });

    it('should throw 404 error when profile is not found', async () => {
      dbMock.getProfile.mockResolvedValue(undefined);

      await expect(profilesService.getProfileOfTargetUser('unknown', 1)).rejects.toThrow(
        '404: A profile with the specified username was not found.'
      );
    });
  });

  describe('followUser', () => {
    it('should call followUser on db and return target profile', async () => {
      dbMock.followUser.mockResolvedValue(undefined);
      dbMock.getProfile.mockResolvedValue({
        username: 'celeb',
        bio: '',
        image: '',
        following: 1,
      });

      const result = await profilesService.followUser('celeb', 1);

      expect(dbMock.followUser).toHaveBeenCalledWith(1, 'celeb');
      expect(result.profile.following).toBe(true);
    });
  });

  describe('unfollowUser', () => {
    it('should call unfollowUser on db and return target profile', async () => {
      dbMock.unfollowUser.mockResolvedValue(undefined);
      dbMock.getProfile.mockResolvedValue({
        username: 'celeb',
        bio: '',
        image: '',
        following: 0,
      });

      const result = await profilesService.unfollowUser('celeb', 1);

      expect(dbMock.unfollowUser).toHaveBeenCalledWith(1, 'celeb');
      expect(result.profile.following).toBe(false);
    });
  });
});
