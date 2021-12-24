import { Controller, Req, Res, Status } from '@ditsmod/core';
import { JwtService } from '@ditsmod/jwt';
import { OasRoute } from '@ditsmod/openapi';
import { Level } from '@ditsmod/logger';

import { BearerGuard } from '@service/auth/bearer.guard';
import { CustomError } from '@service/error-handler/custom-error';
import { ServerMsg } from '@service/msg/server-msg';
import { getRequestBody, Responses } from '@utils/oas-helpers';
import { DbService } from './db.service';
import { LoginFormData, PutUser, PutUserData, SignUpFormData, UserSessionData } from './models';

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
    ...new Responses(UserSessionData, 'After registration, this data is sent to the client.', Status.CREATED)
      .getUnprocessableEnryResponse(),
  })
  async signUpUser() {
    const signUpFormData = this.req.body as SignUpFormData;
    const userId = await this.db.signUpUser(signUpFormData);
    const userSessionData = new UserSessionData(signUpFormData.user);
    userSessionData.user.token = await this.jwtService.signWithSecret({ userId });
    this.res.sendJson(userSessionData, Status.CREATED);
  }

  @OasRoute('POST', 'users/login', [], {
    description: 'User login.',
    tags: ['users'],
    ...getRequestBody(LoginFormData, 'Data that a user should send for loggining.'),
    ...new Responses(UserSessionData, 'After login, this data is sent to the client.')
      .getUnprocessableEnryResponse(),
  })
  async signInUser() {
    const { user } = this.req.body as LoginFormData;
    const dbUser = await this.db.signInUser(user);
    if (!dbUser) {
      throw new CustomError({
        msg1: this.serverMsg.badPasswordOrEmail,
        args1: ['password-or-email'],
        status: Status.UNAUTHORIZED,
      });
    }
    const userSessionData = new UserSessionData(dbUser);
    userSessionData.user.token = await this.jwtService.signWithSecret({ userId: dbUser.userId });
    this.res.sendJson(userSessionData);
  }

  @OasRoute('GET', 'user', [BearerGuard], {
    description: 'Info about current user.',
    tags: ['user'],
    ...new Responses(UserSessionData, 'Description for response content.').getNotFoundResponse('User not found.'),
  })
  async getCurrentUser() {
    const userId = this.req.jwtPayload.userId as number;
    const dbUser = await this.db.getCurrentUser(userId);
    if (!dbUser) {
      throw new CustomError({
        msg1: this.serverMsg.internalError,
        args1: ['auth-token'],
        status: Status.INTERNAL_SERVER_ERROR,
        level: Level.error,
      });
    }
    const userSessionData = new UserSessionData(dbUser);
    userSessionData.user.token = await this.jwtService.signWithSecret({ userId });
    this.res.sendJson(userSessionData);
  }

  @OasRoute('PUT', 'user', [BearerGuard], {
    description: 'Update current user.',
    tags: ['user'],
    ...getRequestBody(PutUserData, 'Any of this properties are required.'),
    ...new Responses(UserSessionData, 'Returns the User.')
      .setNotFoundResponse()
      .getUnprocessableEnryResponse(),
  })
  async updateCurrentUser() {
    const userId = this.req.jwtPayload.userId as number;
    const putUser = this.req.body as PutUser;
    const okPacket = await this.db.putCurrentUser(userId, putUser);
    if (!okPacket.affectedRows) {
      throw new CustomError({
        msg1: this.serverMsg.internalError,
        args1: ['auth-token'],
        status: Status.INTERNAL_SERVER_ERROR,
        level: Level.error,
      });
    }
    await this.getCurrentUser();
  }
}
