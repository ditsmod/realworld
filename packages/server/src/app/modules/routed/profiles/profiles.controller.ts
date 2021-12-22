import { Injector } from '@ts-stack/di';
import { Controller, Req, Res } from '@ditsmod/core';
import { getParams, OasRoute } from '@ditsmod/openapi';

import { Params } from '@models/params';
import { BearerGuard } from '@service/auth/bearer.guard';
import { getNoContentResponse, getNotFoundResponse, getResponseWithModel, getUnprocessableEnryResponse } from '@models/oas-helpers';
import { UtilService } from '@service/util/util.service';
import { AssertService } from '@service/validation/assert.service';
import { ProfileData } from './models';
import { DbService } from './db.service';

@Controller()
export class ProfilesController {
  constructor(
    private req: Req,
    private res: Res,
    private db: DbService,
    private injector: Injector,
    private util: UtilService,
    private assert: AssertService
  ) {}

  @OasRoute('GET', ':username', [], {
    description: 'Returns a profile for target user.',
    parameters: getParams('path', true, Params, 'username'),
    responses: {
      ...getResponseWithModel(ProfileData, 'Show profile for target username.'),
      ...getUnprocessableEnryResponse(),
      ...getNotFoundResponse('A profile with the specified username was not found.'),
    },
  })
  async getProfileOfTargetUser() {
    const targetUserName = this.req.pathParams.username as string;
    const currentUserId = await this.getCurrentUserId();
    const profile = await this.db.getProfile(currentUserId, targetUserName);
    if (!profile) {
      this.util.throw404Error('username', 'A profile with the specified username was not found.');
    }
    profile.following = this.assert.convertToBool(profile.following);
    const profileData = new ProfileData();
    profileData.profile = profile;
    this.res.sendJson(profileData);
  }

  /**
   * In real world spec auth is optional https://gothinkster.github.io/realworld/docs/specs/backend-specs/endpoints/#get-profile
   *
   * So, if current user pass auth, we have jwtPayload.
   */
  private async getCurrentUserId() {
    const guard = this.injector.get(BearerGuard) as BearerGuard; // Lazy load auth.
    await guard.canActivate();
    return this.req.jwtPayload?.userId || 0;
  }

  @OasRoute('POST', ':username/follow', [BearerGuard], {
    parameters: getParams('path', true, Params, 'username'),
    responses: { ...getResponseWithModel(ProfileData, 'Description for response content.') },
  })
  async followUser() {
    const form = new ProfileData();
    this.res.sendJson(form);
  }

  @OasRoute('DELETE', ':username/follow', [BearerGuard], {
    parameters: getParams('path', true, Params, 'username'),
    ...getNoContentResponse(),
  })
  async deleteFollowUser() {
    const form = new ProfileData();
    this.res.sendJson(form);
  }
}
