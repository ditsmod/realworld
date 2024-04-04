import { ResultSetHeader } from 'mysql2';
import { injectable, CustomError } from '@ditsmod/core';
import { DictService } from '@ditsmod/i18n';

import { InsertRunOptions, MysqlService, SelectRunOptions } from '#service/mysql/mysql.service.js';
import { ServerDict } from '#service/openapi-with-params/locales/current/index.js';
import { CryptoService } from '#service/auth/crypto.service.js';
import { DbUser, EmailOrUsername } from './types.js';
import { Tables, LoginData, PutUser, SignUpFormData, UserSession } from './models.js';

@injectable()
export class DbService {
  constructor(
    private mysql: MysqlService<Tables>,
    private dictService: DictService,
    private cryptoService: CryptoService
  ) {}

  /**
   * Returns inserted user ID or throw an error about user exists.
   */
  async signUpUser(signUpFormData: SignUpFormData): Promise<number> {
    const { email, username, password: rawPassword } = signUpFormData.user;
    await this.checkUserExists({ email, username });
    const password = this.cryptoService.getCryptedPassword(rawPassword);
    return this.mysql
      .insertFromSet('curr_users', { email, username, password })
      .$run<number, InsertRunOptions>({ insertId: true });
  }

  async checkUserExists({ email, username }: EmailOrUsername) {
    const result = await this.mysql
      .select('1 as userExists')
      .from('curr_users')
      .where((eb) => eb.isTrue({ email, username }))
      .$run();

    if (result.length) {
      const dict = this.dictService.getDictionary(ServerDict);
      throw new CustomError({
        msg1: dict.usernameOrEmailAlreadyExists('email-or-username'),
        level: 'trace',
      });
    }
  }

  /**
   * Returns user ID or throw an error about user exists.
   */
  signInUser({ email, password }: LoginData) {
    password = this.cryptoService.getCryptedPassword(password);
    return this.mysql
      .select('userId', 'username', 'email', 'bio', 'image')
      .from('curr_users')
      .where((eb) => eb.isTrue({ email, password }))
      .$run<DbUser, SelectRunOptions>({ first: true });
  }

  getCurrentUser(userId: number) {
    return this.mysql
      .select('userId', 'username', 'email', 'bio', 'image')
      .from('curr_users')
      .where((eb) => eb.isTrue({ userId }))
      .$run<Omit<UserSession, 'token'>, SelectRunOptions>({ first: true });
  }

  putCurrentUser(userId: number, pubUser: PutUser) {
    const { email, username, password, image, bio } = pubUser;
    return this.mysql
      .update('curr_users')
      .set(`email = ifnull(?, email)`)
      .set(`username = ifnull(?, username)`)
      .set(`password = ifnull(?, password)`)
      .set(`image = ifnull(?, image)`)
      .set(`bio = ifnull(?, bio)`)
      .where({ userId })
      .$run<ResultSetHeader>({}, email, username, password, image, bio);
  }
}
