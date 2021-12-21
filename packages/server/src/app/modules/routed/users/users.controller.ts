import { Controller, Req, Res, Status } from '@ditsmod/core';
import { JwtService } from '@ditsmod/jwt';
import { OasRoute } from '@ditsmod/openapi';

import { BearerGuard } from '@service/auth/bearer.guard';
import { CustomError } from '@service/error-handler/custom-error';
import { ServerMsg } from '@service/msg/server-msg';
import { getRequestBody, getResponses } from '@models/oas-helpers';
import { DbService } from './db.service';
import { LoginFormData, PutUser, SignUpFormData, UserSessionData } from './models';

@Controller()
export class UsersController {
  constructor(
    private req: Req,
    private res: Res,
    private db: DbService,
    private jwtService: JwtService,
    private serverMsg: ServerMsg
  ) {}

  @OasRoute('POST', 'users', [], {
    description: 'User registration.',
    tags: ['users'],
    ...getRequestBody(SignUpFormData, 'Data that a user should send for registration.'),
    ...getResponses(UserSessionData, 'After registration, this data is sent to the client.', Status.CREATED),
  })
  async addUser() {
    const signUpFormData = this.req.body as SignUpFormData;
    const userId = await this.db.signUpUser(signUpFormData);
    const userSessionData = new UserSessionData();
    userSessionData.user.email = signUpFormData.user.email;
    userSessionData.user.username = signUpFormData.user.username;
    userSessionData.user.token = await this.jwtService.signWithSecret({ userId });
    this.res.sendJson(userSessionData, Status.CREATED);
  }

  @OasRoute('POST', 'users/login', [], {
    description: 'User login.',
    tags: ['users'],
    ...getRequestBody(LoginFormData, 'Data that a user should send for loggining.'),
    ...getResponses(UserSessionData, 'After login, this data is sent to the client.'),
  })
  async loginUser() {
    const { user } = this.req.body as LoginFormData;
    const dbUser = await this.db.loginUser(user);
    if (!dbUser) {
      throw new CustomError({
        msg1: this.serverMsg.badPasswordOrEmail,
        args1: ['password-or-email'],
        status: Status.UNAUTHORIZED,
      });
    }
    const userSessionData = new UserSessionData();
    userSessionData.user.email = dbUser.email;
    userSessionData.user.token = await this.jwtService.signWithSecret({ userId: dbUser.user_id });
    userSessionData.user.bio = dbUser.bio;
    userSessionData.user.image = dbUser.image;
    userSessionData.user.username = dbUser.username;
    this.res.sendJson(userSessionData);
  }

  @OasRoute('GET', 'user', [BearerGuard], {
    description: 'Info about current user.',
    tags: ['user'],
    ...getResponses(UserSessionData, 'Description for response content.', Status.OK, false),
  })
  async getCurrentUser() {
    const form = new UserSessionData();
    form.user.token = await this.jwtService.signWithSecret({ email: form.user.email });
    this.res.sendJson(form);
  }

  @OasRoute('PUT', 'user', [BearerGuard], {
    tags: ['user'],
    ...getRequestBody(PutUser, 'Description for requestBody.'),
    ...getResponses(Boolean, 'Description for response content.', Status.NO_CONTENT, false),
  })
  async updateCurrentUser() {
    const form = new UserSessionData();
    form.user.token = await this.jwtService.signWithSecret({ email: form.user.email });
    this.res.sendJson(form);
  }
}
