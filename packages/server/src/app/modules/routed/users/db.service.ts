import { OkPacket } from 'mysql';
import { Injectable } from '@ts-stack/di';
import { CustomError } from '@ditsmod/core';

import { MysqlService } from '@service/mysql/mysql.service';
import { ServerDict } from '@service/msg/server.dict';
import { CryptoService } from '@service/auth/crypto.service';
import { DbUser, EmailOrUsername } from './types';
import { LoginData, PutUser, SignUpFormData, UserSession } from './models';

@Injectable()
export class DbService {
  constructor(private mysql: MysqlService, private serverMsg: ServerDict, private cryptoService: CryptoService) {}

  /**
   * Returns inserted user ID or throw an error about user exists.
   */
  async signUpUser(signUpFormData: SignUpFormData): Promise<number> {
    const { email, username, password } = signUpFormData.user;
    await this.checkUserExists({ email, username });
    const params: any[] = [email, username, this.cryptoService.getCryptedPassword(password)];
    const sql = `insert into curr_users set email = ?, username = ?, password = ?;`;
    const { rows } = await this.mysql.query(sql, params);
    return (rows as OkPacket).insertId;
  }

  async checkUserExists({ email, username }: EmailOrUsername) {
    const sql = `select 1 as userExists from curr_users where email = ? or username = ?;`;
    const { rows } = await this.mysql.query(sql, [email, username]);
    if ((rows as any[]).length) {
      throw new CustomError({
        msg1: this.serverMsg.usernameOrEmailAlreadyExists,
        // args1: ['email-or-username'],
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
