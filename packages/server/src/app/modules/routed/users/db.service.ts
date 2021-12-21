import { OkPacket } from 'mysql';
import { Injectable } from '@ts-stack/di';
import { Level } from '@ditsmod/logger';

import { MysqlService } from '@service/mysql/mysql.service';
import { CustomError } from '@service/error-handler/custom-error';
import { ServerMsg } from '@service/msg/server-msg';
import { CryptoService } from '@service/auth/crypto.service';
import { DbUser, EmailOrUsername } from './types';
import { LoginData, SignUpFormData } from './models';

@Injectable()
export class DbService {
  constructor(private mysql: MysqlService, private serverMsg: ServerMsg, private cryptoService: CryptoService) {}

  /**
   * Returns inserted user ID or throw an error about user exists.
   */
  async signUpUser(signUpFormData: SignUpFormData): Promise<number> {
    const { email, username, password } = signUpFormData.user;
    await this.checkUserExists({ email, username });
    const params: any[] = [email, username, this.cryptoService.getCryptedPassword(password)];
    const sql = `insert into cur_users set email = ?, username = ?, password = ?;`;
    const { rows } = await this.mysql.query(sql, params);
    return (rows as OkPacket).insertId;
  }

  async checkUserExists({ email, username }: EmailOrUsername) {
    const sql = `select 1 as userExists from cur_users where email = ? or username = ?;`;
    const { rows } = await this.mysql.query(sql, [email, username]);
    if ((rows as any[]).length) {
      throw new CustomError({
        msg1: this.serverMsg.usernameOrEmailAlreadyExists,
        args1: ['email-or-username'],
        level: Level.trace,
      });
    }
  }

  /**
   * Returns user ID or throw an error about user exists.
   */
  async loginUser({ email, password }: LoginData): Promise<DbUser> {
    const params: any[] = [email, this.cryptoService.getCryptedPassword(password)];
    const sql = `
    select
      user_id,
      username,
      email,
      bio,
      image
    from cur_users
    where email = ?
      and password = ?;`;
    const { rows } = await this.mysql.query(sql, params);
    return (rows as DbUser[])[0];
  }
}
