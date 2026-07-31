import { HttpStatus, injectable, Injector } from '@ditsmod/core';
import { CustomError } from '@ditsmod/core/errors';
import { DictService } from '@ditsmod/i18n';
import { JwtService } from '@ditsmod/jwt';

import { ServerDict } from '#service/openapi-with-params/locales/current/index.js';
import { DbService } from './db.service.js';
import { LoginFormDto, PutUserDto, SignUpDto, SignUpFormDto, UserSessionDataDto } from './users.dto.js';

@injectable()
export class UsersService {
  constructor(
    private db: DbService,
    private jwtService: JwtService,
    private injector: Injector
  ) {}

  async signUpUser(signUpFormData: SignUpFormDto) {
    const userId = await this.db.signUpUser(signUpFormData);
    delete (signUpFormData.user as Partial<SignUpDto>).password;
    const userSessionData = new UserSessionDataDto(signUpFormData.user);
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
    const userSessionData = new UserSessionDataDto(dbUser);
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
    const userSessionData = new UserSessionDataDto(dbUser);
    userSessionData.user.token = await this.jwtService.signWithSecret({ userId });
    return userSessionData;
  }

  async updateCurrentUser(userId: number, putUser: PutUserDto) {
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
