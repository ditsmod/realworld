import { escape, OkPacket } from 'mysql2';
import { injectable } from '@ditsmod/core';
import { CustomError } from '@ditsmod/core';
import { DictService } from '@ditsmod/i18n';

import { MysqlService } from '@service/mysql/mysql.service';
import { ServerDict } from '@service/openapi-with-params/locales/current';
import { CryptoService } from '@service/auth/crypto.service';
import { DbUser, EmailOrUsername } from './types';
import { Tables, LoginData, PutUser, SignUpFormData, UserSession } from './models';

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
    const okPacket = await this.mysql.insertFromSet('curr_users', { email, username, password }).$run<OkPacket>();
    return okPacket.insertId;
  }

  async checkUserExists({ email, username }: EmailOrUsername) {
    const result = await this.mysql
      .select('1 as userExists')
      .from('curr_users')
      .where((eb) => eb.isTrue({ email, username }))
      .$run<{ userExists: 1 }[]>();

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
  async signInUser({ email, password }: LoginData): Promise<DbUser> {
    const params: any[] = [email, this.cryptoService.getCryptedPassword(password)];
    const sql = `
    select
      userId,
      username,
      email,
      bio,
      image
    from curr_users
    where email = ?
      and password = ?;`;
    const { rows } = await this.mysql.query(sql, params);
    return (rows as DbUser[])[0];
  }

  async getCurrentUser(userId: number) {
    const sql = `
    select
      username,
      email,
      bio,
      image
    from curr_users
    where userId = ${userId};`;
    const { rows } = await this.mysql.query(sql);
    return (rows as Omit<UserSession, 'token'>[])[0];
  }

  async putCurrentUser(userId: number, pubUser: PutUser) {
    const { email, username, password, image, bio } = pubUser;
    const sql = `
    update curr_users
    set
      email = ifnull(?, email),
      username = ifnull(?, username),
      password = ifnull(?, password),
      image = ifnull(?, image),
      bio = ifnull(?, bio)
    where userId = ${userId};`;
    const { rows } = await this.mysql.query(sql, [email, username, password, image, bio]);
    return rows as OkPacket;
  }
}
