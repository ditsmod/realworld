import { controller, CustomError, inject, Status } from '@ditsmod/core';
import { DictService } from '@ditsmod/i18n';
import { JwtService, JWT_PAYLOAD } from '@ditsmod/jwt';
import { oasRoute } from '@ditsmod/openapi';
import { Injector } from '@ditsmod/core';
import { HTTP_BODY } from '@ditsmod/body-parser';

import { BearerGuard } from '#service/auth/bearer.guard.js';
import { ServerDict } from'#service/openapi-with-params/locales/current/index.js';
import { OasOperationObject } from '#utils/oas-helpers.js';
import { DbService } from './db.service.js';
import { LoginFormData, PutUser, PutUserData, SignUpFormData, UserSessionData } from './models.js';

@controller()
export class UsersController {
  constructor(
    @inject(HTTP_BODY) private body: any,
    private db: DbService,
    private jwtService: JwtService,
    private injector: Injector
  ) {}

  @oasRoute('POST', 'users', {
    description: 'User registration.',
    tags: ['users'],
    ...new OasOperationObject()
      .setRequestBody(SignUpFormData, 'Data that a user should send for registration.')
      .getResponse(UserSessionData, 'After registration, this data is sent to the client.', Status.CREATED),
  })
  async signUpUser() {
    const signUpFormData = this.body as SignUpFormData;
    const userId = await this.db.signUpUser(signUpFormData);
    const userSessionData = new UserSessionData(signUpFormData.user);
    userSessionData.user.token = await this.jwtService.signWithSecret({ userId });
    return userSessionData;
  }

  @oasRoute('POST', 'users/login', {
    description: 'User login.',
    tags: ['users'],
    ...new OasOperationObject()
      .setRequestBody(LoginFormData, 'Data that a user should send for loggining.')
      .getResponse(UserSessionData, 'After login, this data is sent to the client.'),
  })
  async signInUser() {
    const { user } = this.body as LoginFormData;
    const dbUser = await this.db.signInUser(user);
    if (!dbUser) {
      const dict = this.getDictionary();
      throw new CustomError({
        msg1: dict.badPasswordOrEmail('password-or-email'),
        status: Status.UNAUTHORIZED,
      });
    }
    const userSessionData = new UserSessionData(dbUser);
    userSessionData.user.token = await this.jwtService.signWithSecret({ userId: dbUser.userId });
    return userSessionData;
  }

  @oasRoute('GET', 'user', [BearerGuard], {
    description: 'Info about current user.',
    tags: ['user'],
    ...new OasOperationObject()
      .setResponse(UserSessionData, 'Description for response content.')
      .getNotFoundResponse('User not found.'),
  })
  async getCurrentUser(@inject(JWT_PAYLOAD) jwtPayload: any) {
    const userId = jwtPayload.userId as number;
    const dbUser = await this.db.getCurrentUser(userId);
    if (!dbUser) {
      const dict = this.getDictionary();
      throw new CustomError({
        msg1: dict.youHaveObsoleteToken('auth-token'),
        status: Status.UNAUTHORIZED,
        level: 'error',
      });
    }
    const userSessionData = new UserSessionData(dbUser);
    userSessionData.user.token = await this.jwtService.signWithSecret({ userId });
    return userSessionData;
  }

  @oasRoute('PUT', 'user', [BearerGuard], {
    description: 'Update current user.',
    tags: ['user'],
    ...new OasOperationObject()
      .setRequestBody(PutUserData, 'Any of this properties are required.')
      .getResponse(UserSessionData, 'Returns the User.'),
  })
  async updateCurrentUser(@inject(JWT_PAYLOAD) jwtPayload: any) {
    const userId = jwtPayload.userId as number;
    const putUser = this.body as PutUser;
    const okPacket = await this.db.putCurrentUser(userId, putUser);
    if (!okPacket.affectedRows) {
      const dict = this.getDictionary();
      throw new CustomError({
        msg1: dict.youHaveObsoleteToken('auth-token'),
        status: Status.UNAUTHORIZED,
        level: 'error',
      });
    }
    return this.getCurrentUser(jwtPayload);
  }

  /**
   * Lazy loading dictionary for errors.
   */
  private getDictionary() {
    const dictService = this.injector.get(DictService) as DictService;
    return dictService.getDictionary(ServerDict);
  }
}
