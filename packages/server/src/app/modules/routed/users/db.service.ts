import { injectable, CustomError } from '@ditsmod/core';
import { DictService } from '@ditsmod/i18n';
import { sql } from 'kysely';

import { MysqlService } from '@service/mysql/mysql.service';
import { ServerDict } from '@service/openapi-with-params/locales/current';
import { CryptoService } from '@service/auth/crypto.service';
import { EmailOrUsername } from './types';
import { Database, LoginData, PutUser, SignUpFormData } from './models';

@injectable()
export class DbService {
  constructor(private mysql: MysqlService, private dictService: DictService, private cryptoService: CryptoService) {}

  /**
   * Returns inserted user ID or throw an error about user exists.
   */
  async signUpUser(signUpFormData: SignUpFormData): Promise<number> {
    const { email, username, password: rawPassword } = signUpFormData.user;
    await this.checkUserExists({ email, username });
    const password = this.cryptoService.getCryptedPassword(rawPassword);
    const db = await this.mysql.getKysely<Database>();
    const { insertId } = await db.insertInto('curr_users').values({ email, username, password }).executeTakeFirst();
    return Number(insertId);
  }

  async checkUserExists({ email, username }: EmailOrUsername) {
    const db = await this.mysql.getKysely<Database>();
    const rows = await db
      .selectFrom('curr_users')
      .select('userId')
      .where('email', '=', email!)
      .where('username', '=', username!)
      .execute();

    if (rows.length) {
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
  async signInUser({ email, password: rawPassword }: LoginData) {
    const db = await this.mysql.getKysely<Database>();
    const password = this.cryptoService.getCryptedPassword(rawPassword);

    return db
      .selectFrom('curr_users')
      .select(['userId', 'username', 'email', 'bio', 'image'])
      .where('email', '=', email)
      .where('password', '=', password)
      .executeTakeFirst();
  }

  async getCurrentUser(userId: number) {
    const db = await this.mysql.getKysely<Database>();
    return db
      .selectFrom('curr_users')
      .select(['username', 'email', 'bio', 'image'])
      .where('userId', '=', userId)
      .executeTakeFirst();
  }

  async putCurrentUser(userId: number, pubUser: PutUser) {
    const { email, username, password: rawPassword, image, bio } = pubUser;
    console.log(pubUser);
    const password = this.cryptoService.getCryptedPassword(rawPassword || '');
    const db = await this.mysql.getKysely<Database>();
    return await db
      .updateTable('curr_users')
      .set({
        email: sql`ifnull(${email}, email)`,
        username: sql`ifnull(${username}, username)`,
        password: sql`ifnull(${password}, password)`,
        image: sql`ifnull(${image}, image)`,
        bio: sql`ifnull(${bio}, bio)`,
      })
      .where('userId', '=', userId)
      .executeTakeFirst();
  }
}
