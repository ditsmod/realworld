import { Controller, Req, Res, Status } from '@ditsmod/core';
import { getParams, OasRoute } from '@ditsmod/openapi';
import { Params } from '@models/params';

import { BearerGuard } from '@service/auth/bearer.guard';
import { getNoContent, getResponses } from '@models/oas-helpers';
import { ProfileData } from './models';

@Controller()
export class ProfilesController {
  constructor(private req: Req, private res: Res) {}

  @OasRoute('GET', ':username', [], {
    parameters: getParams('path', true, Params, 'username'),
    ...getResponses(ProfileData, 'Description for response content.', Status.OK, false),
  })
  async getCurrentUser() {
    const form = new ProfileData();
    this.res.sendJson(form);
  }

  @OasRoute('POST', ':username/follow', [BearerGuard], {
    parameters: getParams('path', true, Params, 'username'),
    ...getResponses(ProfileData, 'Description for response content.', Status.OK, false),
  })
  async followUser() {
    const form = new ProfileData();
    this.res.sendJson(form);
  }

  @OasRoute('DELETE', ':username/follow', [BearerGuard], {
    parameters: getParams('path', true, Params, 'username'),
    ...getNoContent(),
  })
  async deleteFollowUser() {
    const form = new ProfileData();
    this.res.sendJson(form);
  }
}