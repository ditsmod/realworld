import { Controller, Req, Res, Status } from '@ditsmod/core';
import { JwtService } from '@ditsmod/jwt';
import { getContent, OasRoute } from '@ditsmod/openapi';

import { BearerGuard } from '@service/auth/bearer.guard';
import { UserForAuth } from '@routed/users/models';
import { PutUser } from './models';

@Controller()
export class UserController {
  constructor(private req: Req, private res: Res, private jwtService: JwtService) {}

  @OasRoute('GET', '', [BearerGuard], {
    responses: {
      [Status.OK]: {
        description: 'Description for response content',
        content: getContent({ mediaType: 'application/json', model: UserForAuth }),
      },
    },
  })
  async getCurrentUser() {
    const form = new UserForAuth();
    form.user.token = await this.jwtService.signWithSecret({ email: form.user.email });
    this.res.sendJson(form);
  }

  @OasRoute('PUT', '', [BearerGuard], {
    requestBody: {
      description: 'Description for requestBody',
      content: getContent({ mediaType: 'application/json', model: PutUser }),
    },
  })
  async updateCurrentUser() {
    const form = new UserForAuth();
    form.user.token = await this.jwtService.signWithSecret({ email: form.user.email });
    this.res.sendJson(form);
  }
}
