import { Controller, Req, Res, Status } from '@ditsmod/core';
import { JwtService } from '@ditsmod/jwt';
import { getContent, OasRoute } from '@ditsmod/openapi';

import { BearerGuard } from '@service/auth/bearer.guard';
import { LoginFormData, PutUser, SignUpFormData, UserSessionData } from './models';

@Controller()
export class UsersController {
  constructor(private req: Req, private res: Res, private jwtService: JwtService) {}

  @OasRoute('POST', 'users', [], {
    description: 'User registration.',
    tags: ['users'],
    requestBody: {
      description: 'Data that a user should send for registration.',
      content: getContent({ mediaType: 'application/json', model: SignUpFormData }),
    },
    responses: {
      [Status.OK]: {
        description: 'After successful user registration, this data is sent to the client.',
        content: getContent({ mediaType: 'application/json', model: UserSessionData }),
      },
    },
  })
  async addUser() {
    const signUpFormData = this.req.body as SignUpFormData;
    const userSessionData = new UserSessionData();
    userSessionData.user.email = signUpFormData.user.email;
    userSessionData.user.username = signUpFormData.user.username;
    userSessionData.user.token = await this.jwtService.signWithSecret({ email: userSessionData.user.email });
    this.res.sendJson(userSessionData);
  }

  @OasRoute('POST', 'users/login', [], {
    tags: ['users'],
    requestBody: {
      description: 'Description for requestBody',
      content: getContent({ mediaType: 'application/json', model: LoginFormData }),
    },
    responses: {
      [Status.OK]: {
        description: 'Description for response content',
        content: getContent({ mediaType: 'application/json', model: UserSessionData }),
      },
    },
  })
  async loginUser() {
    const form = new UserSessionData();
    form.user.email = this.req.body.email;
    form.user.token = await this.jwtService.signWithSecret({ email: form.user.email });
    this.res.sendJson(form);
  }

  @OasRoute('GET', 'user', [BearerGuard], {
    tags: ['user'],
    responses: {
      [Status.OK]: {
        description: 'Description for response content',
        content: getContent({ mediaType: 'application/json', model: UserSessionData }),
      },
    },
  })
  async getCurrentUser() {
    const form = new UserSessionData();
    form.user.token = await this.jwtService.signWithSecret({ email: form.user.email });
    this.res.sendJson(form);
  }

  @OasRoute('PUT', 'user', [BearerGuard], {
    tags: ['user'],
    requestBody: {
      description: 'Description for requestBody',
      content: getContent({ mediaType: 'application/json', model: PutUser }),
    },
  })
  async updateCurrentUser() {
    const form = new UserSessionData();
    form.user.token = await this.jwtService.signWithSecret({ email: form.user.email });
    this.res.sendJson(form);
  }
}
