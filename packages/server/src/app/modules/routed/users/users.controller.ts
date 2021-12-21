import { Controller, Req, Res, Status } from '@ditsmod/core';
import { JwtService } from '@ditsmod/jwt';
import { getContent, OasRoute } from '@ditsmod/openapi';

import { BearerGuard } from '@service/auth/bearer.guard';
import { CustomError } from '@service/error-handler/custom-error';
import { ServerMsg } from '@service/msg/server-msg';
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
    requestBody: {
      description: 'Data that a user should send for registration.',
      content: getContent({ mediaType: 'application/json', model: SignUpFormData }),
    },
    responses: {
      [Status.CREATED]: {
        description: 'After successful user registration, this data is sent to the client.',
        content: getContent({ mediaType: 'application/json', model: UserSessionData }),
      },
    },
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
    requestBody: {
      description: 'Data that a user should send for loggining.',
      content: getContent({ mediaType: 'application/json', model: LoginFormData }),
    },
    responses: {
      [Status.OK]: {
        description: 'After successful user login, this data is sent to the client.',
        content: getContent({ mediaType: 'application/json', model: UserSessionData }),
      },
    },
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
