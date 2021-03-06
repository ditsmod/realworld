import { Controller, Req, Res } from '@ditsmod/core';
import { OasRoute } from '@ditsmod/openapi';

import { Params } from '@models/params';
import { BearerGuard } from '@service/auth/bearer.guard';
import { OasOperationObject } from '@utils/oas-helpers';
import { UtilService } from '@service/util/util.service';
import { AssertService } from '@service/validation/assert.service';
import { AuthService } from '@service/auth/auth.service';
import { ProfileData } from './models';
import { DbService } from './db.service';

@Controller()
export class ProfilesController {
  constructor(
    private req: Req,
    private res: Res,
    private db: DbService,
    private authService: AuthService,
    private util: UtilService,
    private assert: AssertService
  ) {}

  @OasRoute('GET', ':username', {
    description: 'Returns a profile for target user.',
    ...new OasOperationObject()
      .setRequiredParams('path', Params, 'username')
      .setNotFoundResponse('A profile with the specified username was not found.')
      .getResponse(ProfileData, 'Show profile for target username.'),
  })
  async getProfileOfTargetUser(currentUserId?: number) {
    const targetUserName = this.req.pathParams.username as string;
    currentUserId = currentUserId || (await this.authService.getCurrentUserId());
    const profile = await this.db.getProfile(currentUserId!, targetUserName);
    if (!profile) {
      this.util.throw404Error('username', 'A profile with the specified username was not found.');
    }
    profile.following = this.assert.convertToBool(profile.following);
    const profileData = new ProfileData();
    profileData.profile = profile;
    this.res.sendJson(profileData);
  }

  @OasRoute('POST', ':username/follow', [BearerGuard], {
    ...new OasOperationObject()
      .setRequiredParams('path', Params, 'username')
      .setNotFoundResponse('A profile with the specified username was not found.')
      .getResponse(ProfileData, 'Description for response content.'),
  })
  async followUser() {
    const currentUserId = this.req.jwtPayload?.userId;
    const targetUserName = this.req.pathParams.username as string;
    await this.db.followUser(currentUserId, targetUserName);
    await this.getProfileOfTargetUser(currentUserId);
  }

  @OasRoute('DELETE', ':username/follow', [BearerGuard], {
    ...new OasOperationObject()
      .setRequiredParams('path', Params, 'username')
      .setNoContentResponse()
      .getNotFoundResponse('A profile with the specified username was not found.'),
  })
  async deleteFollowUser() {
    const currentUserId = this.req.jwtPayload?.userId;
    const targetUserName = this.req.pathParams.username as string;
    await this.db.unfollowUser(currentUserId, targetUserName);
    await this.getProfileOfTargetUser(currentUserId);
  }
}
