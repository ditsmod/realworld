import { ctx } from '@ditsmod/core';
import { controller, PATH_PARAMS } from '@ditsmod/rest';
import { oasRoute } from '@ditsmod/openapi';
import { JWT_PAYLOAD } from '@ditsmod/jwt';

import { Params } from '#dto/params.dto.js';
import { BearerGuard } from '#service/auth/bearer.guard.js';
import { OasOperationObject } from '#utils/oas-helpers.js';
import { ProfileData } from './profiles.dto.js';
import { ProfilesService } from './profiles.service.js';

@controller()
export class ProfilesController {
  constructor(
    private profilesService: ProfilesService,
    @ctx(PATH_PARAMS) private pathParams: any,
    @ctx(JWT_PAYLOAD) private jwtPayload: any
  ) {}

  @oasRoute('GET', ':username', {
    description: 'Returns a profile for target user.',
    ...new OasOperationObject()
      .setRequiredParams('path', Params, 'username')
      .setNotFoundResponse('A profile with the specified username was not found.')
      .getResponse(ProfileData, 'Show profile for target username.'),
  })
  async sendProfileOfTargetUser() {
    return this.profilesService.getProfileOfTargetUser(this.pathParams.username as string);
  }

  @oasRoute('POST', ':username/follow', [BearerGuard], {
    ...new OasOperationObject()
      .setRequiredParams('path', Params, 'username')
      .setNotFoundResponse('A profile with the specified username was not found.')
      .getResponse(ProfileData, 'Description for response content.'),
  })
  async followUser() {
    return this.profilesService.followUser(this.pathParams.username as string, this.jwtPayload?.userId);
  }

  @oasRoute('DELETE', ':username/follow', [BearerGuard], {
    ...new OasOperationObject()
      .setRequiredParams('path', Params, 'username')
      .setNoContentResponse()
      .getNotFoundResponse('A profile with the specified username was not found.'),
  })
  async deleteFollowUser() {
    return this.profilesService.unfollowUser(this.pathParams.username as string, this.jwtPayload?.userId);
  }
}
