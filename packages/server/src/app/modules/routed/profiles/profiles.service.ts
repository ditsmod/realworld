import { injectable } from '@ditsmod/core';

import { UtilService } from '#service/util/util.service.js';
import { AuthService } from '#service/auth/auth.service.js';
import { DbService } from './db.service.js';
import { Profile, ProfileData } from './profiles.dto.js';

@injectable()
export class ProfilesService {
  constructor(private db: DbService, private authService: AuthService, private util: UtilService) {}

  async getProfileOfTargetUser(targetUserName: string, currentUserId?: number) {
    currentUserId = currentUserId || (await this.authService.getCurrentUserId());
    const profile = await this.db.getProfile(currentUserId!, targetUserName);
    if (!profile) {
      this.util.throw404Error('username', 'A profile with the specified username was not found.');
    }
    profile!.following = this.util.convertToBool(profile!.following);
    const profileData = new ProfileData();
    profileData.profile = profile! as Profile;
    return profileData;
  }

  async followUser(targetUserName: string, currentUserId?: number) {
    currentUserId = currentUserId || (await this.authService.getCurrentUserId());
    await this.db.followUser(currentUserId!, targetUserName);
    return this.getProfileOfTargetUser(targetUserName, currentUserId);
  }

  async unfollowUser(targetUserName: string, currentUserId?: number) {
    currentUserId = currentUserId || (await this.authService.getCurrentUserId());
    await this.db.unfollowUser(currentUserId!, targetUserName);
    return this.getProfileOfTargetUser(targetUserName, currentUserId);
  }
}
