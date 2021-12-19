import { Controller, Req, Res, Status } from '@ditsmod/core';
import { JwtService } from '@ditsmod/jwt';
import { getContent, OasRoute } from '@ditsmod/openapi';

import { BearerGuard } from '@service/auth/bearer.guard';
import { LoginData, SignUpData, UserForAuth } from './models';

@Controller()
export class UsersController {
  constructor(private req: Req, private res: Res, private jwtService: JwtService) {}

  @OasRoute('POST', '', [], {
    requestBody: {
      description: 'Description for requestBody',
      content: getContent({ mediaType: 'application/json', model: SignUpData }),
    },
    responses: {
      [Status.OK]: {
        description: 'Description for response content',
        content: getContent({ mediaType: 'application/json', model: UserForAuth }),
      },
    },
  })
  async addUser() {
    const form = new UserForAuth();
    form.user.email = this.req.body.email;
    form.user.username = this.req.body.username;
    form.user.token = await this.jwtService.signWithSecret({ email: form.user.email });
    this.res.sendJson(form);
  }

  @OasRoute('POST', 'login', [], {
    requestBody: {
      description: 'Description for requestBody',
      content: getContent({ mediaType: 'application/json', model: LoginData }),
    },
    responses: {
      [Status.OK]: {
        description: 'Description for response content',
        content: getContent({ mediaType: 'application/json', model: UserForAuth }),
      },
    },
  })
  async loginUser() {
    const form = new UserForAuth();
    form.user.email = this.req.body.email;
    form.user.token = await this.jwtService.signWithSecret({ email: form.user.email });
    this.res.sendJson(form);
  }
}
