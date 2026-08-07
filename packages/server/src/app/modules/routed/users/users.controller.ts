import { HttpStatus, ctx } from '@holu/core';
import { JWT_PAYLOAD } from '@holu/jwt';
import { oasRoute } from '@holu/openapi';
import { HTTP_BODY } from '@holu/body-parser';
import { controller } from '@holu/rest';

import { BearerGuard, type JwtAuthPayload } from '#service/auth/bearer.guard.js';
import { OasOperationObject } from '#utils/oas-helpers.js';
import { LoginFormDto, PutUserItemDto, PutUserDto, SignUpFormDto, UserSessionDto } from './users.dto.js';
import { UsersService } from './users.service.js';

@controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @oasRoute('POST', 'users', {
    description: 'User registration.',
    tags: ['users'],
    ...new OasOperationObject()
      .setRequestBody(SignUpFormDto, 'Data that a user should send for registration.')
      .getResponse(UserSessionDto, 'After registration, this data is sent to the client.', HttpStatus.CREATED),
  })
  async signUpUser(@ctx(HTTP_BODY) body: SignUpFormDto) {
    return this.usersService.signUpUser(body);
  }

  @oasRoute('POST', 'users/login', {
    description: 'User login.',
    tags: ['users'],
    ...new OasOperationObject()
      .setRequestBody(LoginFormDto, 'Data that a user should send for loggining.')
      .getResponse(UserSessionDto, 'After login, this data is sent to the client.'),
  })
  async signInUser(@ctx(HTTP_BODY) body: LoginFormDto) {
    return this.usersService.signInUser(body);
  }

  @oasRoute('GET', 'user', [BearerGuard], {
    description: 'Info about current user.',
    tags: ['user'],
    ...new OasOperationObject()
      .setResponse(UserSessionDto, 'Description for response content.')
      .getNotFoundResponse('User not found.'),
  })
  async getCurrentUser(@ctx(JWT_PAYLOAD) jwtPayload: JwtAuthPayload) {
    return this.usersService.getCurrentUser(jwtPayload.userId);
  }

  @oasRoute('PUT', 'user', [BearerGuard], {
    description: 'Update current user.',
    tags: ['user'],
    ...new OasOperationObject()
      .setRequestBody(PutUserDto, 'Any of this properties are required.')
      .getResponse(UserSessionDto, 'Returns the User.'),
  })
  async updateCurrentUser(
    @ctx(JWT_PAYLOAD) jwtPayload: JwtAuthPayload,
    @ctx(HTTP_BODY) body: PutUserDto | PutUserItemDto
  ) {
    const userId = jwtPayload.userId;
    const putUser = (body as PutUserDto)?.user || (body as PutUserItemDto);
    return this.usersService.updateCurrentUser(userId, putUser);
  }
}
