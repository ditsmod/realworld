import { HttpStatus, injectable, Injector } from '@holu/core';
import { CustomError } from '@holu/core/errors';
import { DictService } from '@holu/i18n';
import { JwtService } from '@holu/jwt';

import { ServerDict } from '#service/openapi-with-params/locales/current/index.js';
import { DbService } from './db.service.js';
import { LoginFormDto, PutUserItemDto, SignUpDto, SignUpFormDto, UserSessionDto } from './users.dto.js';

@injectable()
export class UsersService {
  constructor(private db: DbService, private jwtService: JwtService, private injector: Injector) {}

  async signUpUser(signUpFormData: SignUpFormDto) {
    const userId = await this.db.signUpUser(signUpFormData);
    delete (signUpFormData.user as Partial<SignUpDto>).password;
    const userSessionData = new UserSessionDto(signUpFormData.user);
    userSessionData.user.token = await this.jwtService.signWithSecret({ userId });
    return userSessionData;
  }

  async signInUser(loginFormData: LoginFormDto) {
    const { user } = loginFormData;
    const dbUser = await this.db.signInUser(user);
    if (!dbUser) {
      const dict = this.getDictionary();
      throw new CustomError({
        msg1: dict.badPasswordOrEmail('password-or-email'),
        status: HttpStatus.UNAUTHORIZED,
        level: 'trace',
      });
    }
    const userSessionData = new UserSessionDto(dbUser);
    userSessionData.user.token = await this.jwtService.signWithSecret({ userId: dbUser.userId });
    return userSessionData;
  }

  async getCurrentUser(userId: number) {
    const dbUser = await this.db.getCurrentUser(userId);
    if (!dbUser) {
      const dict = this.getDictionary();
      throw new CustomError({
        msg1: dict.youHaveObsoleteToken('auth-token'),
        status: HttpStatus.UNAUTHORIZED,
        level: 'error',
      });
    }
    const userSessionData = new UserSessionDto(dbUser);
    userSessionData.user.token = await this.jwtService.signWithSecret({ userId });
    return userSessionData;
  }

  async updateCurrentUser(userId: number, putUser: PutUserItemDto) {
    const result = await this.db.putCurrentUser(userId, putUser);
    if (!result.affectedRows) {
      const dict = this.getDictionary();
      throw new CustomError({
        msg1: dict.youHaveObsoleteToken('auth-token'),
        status: HttpStatus.UNAUTHORIZED,
        level: 'error',
      });
    }
    return this.getCurrentUser(userId);
  }

  private getDictionary() {
    const dictService = this.injector.get(DictService) as DictService;
    return dictService.getDictionary(ServerDict);
  }
}
