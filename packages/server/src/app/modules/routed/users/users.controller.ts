import { HttpStatus, ctx } from '@ditsmod/core';
import { JWT_PAYLOAD } from '@ditsmod/jwt';
import { oasRoute } from '@ditsmod/openapi';
import { HTTP_BODY } from '@ditsmod/body-parser';
import { controller } from '@ditsmod/rest';

import { BearerGuard } from '#service/auth/bearer.guard.js';
import { OasOperationObject } from '#utils/oas-helpers.js';
import { LoginFormData, PutUser, PutUserData, SignUpFormData, UserSessionData } from './models.js';
import { UsersService } from './users.service.js';

@controller()
export class UsersController {
  constructor(@ctx(HTTP_BODY) private body: any, private usersService: UsersService) {}

  @oasRoute('POST', 'users', {
    description: 'User registration.',
    tags: ['users'],
    ...new OasOperationObject()
      .setRequestBody(SignUpFormData, 'Data that a user should send for registration.')
      .getResponse(UserSessionData, 'After registration, this data is sent to the client.', HttpStatus.CREATED),
  })
  async signUpUser() {
    return this.usersService.signUpUser(this.body as SignUpFormData);
  }

  @oasRoute('POST', 'users/login', {
    description: 'User login.',
    tags: ['users'],
    ...new OasOperationObject()
      .setRequestBody(LoginFormData, 'Data that a user should send for loggining.')
      .getResponse(UserSessionData, 'After login, this data is sent to the client.'),
  })
  async signInUser() {
    return this.usersService.signInUser(this.body as LoginFormData);
  }

  @oasRoute('GET', 'user', [BearerGuard], {
    description: 'Info about current user.',
    tags: ['user'],
    ...new OasOperationObject()
      .setResponse(UserSessionData, 'Description for response content.')
      .getNotFoundResponse('User not found.'),
  })
  async getCurrentUser(@ctx(JWT_PAYLOAD) jwtPayload: any) {
    return this.usersService.getCurrentUser(jwtPayload.userId as number);
  }

  @oasRoute('PUT', 'user', [BearerGuard], {
    description: 'Update current user.',
    tags: ['user'],
    ...new OasOperationObject()
      .setRequestBody(PutUserData, 'Any of this properties are required.')
      .getResponse(UserSessionData, 'Returns the User.'),
  })
  async updateCurrentUser(@ctx(JWT_PAYLOAD) jwtPayload: any) {
    const userId = jwtPayload.userId as number;
    const putUser = (this.body as PutUserData)?.user || (this.body as PutUser);
    return this.usersService.updateCurrentUser(userId, putUser);
  }
}
