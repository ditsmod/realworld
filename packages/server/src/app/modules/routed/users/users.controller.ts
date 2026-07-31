import { HttpStatus, ctx } from '@ditsmod/core';
import { JWT_PAYLOAD } from '@ditsmod/jwt';
import { oasRoute } from '@ditsmod/openapi';
import { HTTP_BODY } from '@ditsmod/body-parser';
import { controller } from '@ditsmod/rest';

import { BearerGuard, type JwtAuthPayload } from '#service/auth/bearer.guard.js';
import { OasOperationObject } from '#utils/oas-helpers.js';
import { LoginFormDto, PutUserDto, PutUserDataDto, SignUpFormDto, UserSessionDataDto } from './users.dto.js';
import { UsersService } from './users.service.js';

@controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @oasRoute('POST', 'users', {
    description: 'User registration.',
    tags: ['users'],
    ...new OasOperationObject()
      .setRequestBody(SignUpFormDto, 'Data that a user should send for registration.')
      .getResponse(UserSessionDataDto, 'After registration, this data is sent to the client.', HttpStatus.CREATED),
  })
  async signUpUser(@ctx(HTTP_BODY) body: SignUpFormDto) {
    return this.usersService.signUpUser(body);
  }

  @oasRoute('POST', 'users/login', {
    description: 'User login.',
    tags: ['users'],
    ...new OasOperationObject()
      .setRequestBody(LoginFormDto, 'Data that a user should send for loggining.')
      .getResponse(UserSessionDataDto, 'After login, this data is sent to the client.'),
  })
  async signInUser(@ctx(HTTP_BODY) body: LoginFormDto) {
    return this.usersService.signInUser(body);
  }

  @oasRoute('GET', 'user', [BearerGuard], {
    description: 'Info about current user.',
    tags: ['user'],
    ...new OasOperationObject()
      .setResponse(UserSessionDataDto, 'Description for response content.')
      .getNotFoundResponse('User not found.'),
  })
  async getCurrentUser(@ctx(JWT_PAYLOAD) jwtPayload: JwtAuthPayload) {
    return this.usersService.getCurrentUser(jwtPayload.userId);
  }

  @oasRoute('PUT', 'user', [BearerGuard], {
    description: 'Update current user.',
    tags: ['user'],
    ...new OasOperationObject()
      .setRequestBody(PutUserDataDto, 'Any of this properties are required.')
      .getResponse(UserSessionDataDto, 'Returns the User.'),
  })
  async updateCurrentUser(
    @ctx(JWT_PAYLOAD) jwtPayload: JwtAuthPayload,
    @ctx(HTTP_BODY) body: PutUserDataDto | PutUserDto
  ) {
    const userId = jwtPayload.userId;
    const putUser = (body as PutUserDataDto)?.user || (body as PutUserDto);
    return this.usersService.updateCurrentUser(userId, putUser);
  }
}
