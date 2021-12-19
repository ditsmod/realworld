import { Controller, Req, Res, Status } from '@ditsmod/core';
import { getContent, getParams, OasRoute } from '@ditsmod/openapi';
import { Params } from '@models/params';

import { BearerGuard } from '@service/auth/bearer.guard';
import { ProfileData } from './models';

@Controller()
export class ProfilesController {
  constructor(private req: Req, private res: Res) {}

  @OasRoute('GET', ':username', [], {
    parameters: getParams('path', true, Params, 'username'),
    responses: {
      [Status.OK]: {
        description: 'Description for response content',
        content: getContent({ mediaType: 'application/json', model: ProfileData }),
      },
    },
  })
  async getCurrentUser() {
    const form = new ProfileData();
    this.res.sendJson(form);
  }

  @OasRoute('POST', ':username/follow', [BearerGuard], {
    parameters: getParams('path', true, Params, 'username'),
    responses: {
      [Status.OK]: {
        description: 'Description for response content',
        content: getContent({ mediaType: 'application/json', model: ProfileData }),
      },
    },
  })
  async followUser() {
    const form = new ProfileData();
    this.res.sendJson(form);
  }

  @OasRoute('DELETE', ':username/follow', [BearerGuard], {
    parameters: getParams('path', true, Params, 'username'),
    responses: {
      [Status.OK]: {
        description: 'Description for response content',
        content: getContent({ mediaType: 'application/json', model: ProfileData }),
      },
    },
  })
  async deleteFollowUser() {
    const form = new ProfileData();
    this.res.sendJson(form);
  }
}