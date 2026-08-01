import { ctx } from '@ditsmod/core';
import { controller, PATH_PARAMS } from '@ditsmod/rest';
import { oasRoute } from '@ditsmod/openapi';
import { JWT_PAYLOAD } from '@ditsmod/jwt';

import { ParamsDto } from '#dto/params.dto.js';
import { BearerGuard, type JwtAuthPayload } from '#service/auth/bearer.guard.js';
import { OasOperationObject } from '#utils/oas-helpers.js';
import { ProfileDto } from './profiles.dto.js';
import { ProfilesService } from './profiles.service.js';

@controller()
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @oasRoute('GET', ':username', {
    description: 'Returns a profile for target user.',
    ...new OasOperationObject()
      .setRequiredParams('path', ParamsDto, 'username')
      .setNotFoundResponse('A profile with the specified username was not found.')
      .getResponse(ProfileDto, 'Show profile for target username.'),
  })
  async sendProfileOfTargetUser(@ctx(PATH_PARAMS) pathParams: Record<'username', string>) {
    return this.profilesService.getProfileOfTargetUser(pathParams.username);
  }

  @oasRoute('POST', ':username/follow', [BearerGuard], {
    ...new OasOperationObject()
      .setRequiredParams('path', ParamsDto, 'username')
      .setNotFoundResponse('A profile with the specified username was not found.')
      .getResponse(ProfileDto, 'Description for response content.'),
  })
  async followUser(
    @ctx(PATH_PARAMS) pathParams: Record<'username', string>,
    @ctx(JWT_PAYLOAD) jwtPayload: JwtAuthPayload
  ) {
    return this.profilesService.followUser(pathParams.username, jwtPayload.userId);
  }

  @oasRoute('DELETE', ':username/follow', [BearerGuard], {
    ...new OasOperationObject()
      .setRequiredParams('path', ParamsDto, 'username')
      .setNoContentResponse()
      .getNotFoundResponse('A profile with the specified username was not found.'),
  })
  async deleteFollowUser(
    @ctx(PATH_PARAMS) pathParams: Record<'username', string>,
    @ctx(JWT_PAYLOAD) jwtPayload: JwtAuthPayload
  ) {
    return this.profilesService.unfollowUser(pathParams.username, jwtPayload.userId);
  }
}
