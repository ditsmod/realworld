import { createPool, Pool, PoolConnection, MysqlError, OkPacket } from 'mysql';
import { Injectable } from '@ts-stack/di';
import { Level } from '@ditsmod/logger';
import { Status, edk } from '@ditsmod/core';

import { ServerMsg } from '@service/msg/server-msg';
import { CustomError } from '@service/error-handler/custom-error';
import { MySqlConfigService } from './mysql-config.service';

@Injectable()
export class MysqlService {
  private pools: { [database: string]: Pool } = {};

  constructor(private config: MySqlConfigService, private serverMsg: ServerMsg) {}

  getConnection(dbName?: string): Promise<PoolConnection> {
    return new Promise((resolve, reject) => {
      const config = {...this.config};
      const database = (dbName || config.database) as string;
      config.database = database;
      if (!this.pools[database]) {
        this.pools[database] = createPool(config);
      }

      this.pools[database].getConnection((err, connection) => {
        if (err) {
          this.handleErr(this.serverMsg.mysqlConnect, err, reject);
        } else {
          resolve(connection);
        }
      });
    });
  }

  async query<T = edk.AnyObj>(sql: string, params?: any, dbName?: string): Promise<T[] | [T[], OkPacket] | OkPacket> {
    const connection = await this.getConnection(dbName);
    return new Promise((resolve, reject) => {
      connection.query(sql, params, (err, rows, fields) => {
        connection.release();
        if (err) {
          this.handleErr(this.serverMsg.mysqlQuery, err, reject);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async startTransaction(dbName?: string) {
    const connection = await this.getConnection(dbName);
    connection.beginTransaction();
    return connection;
  }

  queryInTransaction<T = edk.AnyObj>(
    connection: PoolConnection,
    sql: string,
    params?: any
  ): Promise<T[] | [T[], OkPacket] | OkPacket> {
    return new Promise((resolve, reject) => {
      connection.query(sql, params, (err, rows, fields) => {
        if (err) {
          connection.rollback();
          connection.release();
          this.handleErr(this.serverMsg.mysqlQuery, err, reject);
        } else {
          resolve(rows);
        }
      });
    });
  }

  commit(connection: PoolConnection): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.commit((err) => {
        if (err) {
          connection.rollback();
          this.handleErr(this.serverMsg.errMysqlCommit, err, reject);
        } else {
          resolve();
        }
        connection.release();
      });
    });
  }

  async procedure<T extends edk.AnyObj = edk.AnyObj>(sql: string, params?: any, dbName?: string): Promise<T[]> {
    const result = (await this.query(sql, params, dbName)) as [T[], OkPacket];
    return result[0];
  }

  async procedureInTransaction<T extends edk.AnyObj = edk.AnyObj>(
    connection: PoolConnection,
    sql: string,
    params?: any
  ): Promise<T[]> {
    const result = (await this.queryInTransaction(connection, sql, params)) as [T[], OkPacket];
    return result[0];
  }

  async multiResult<T>(sql: string, params?: any, dbName?: string) {
    type Multi<R> = [R] extends [[infer Item0]]
      ? [Item0[]]
      : [R] extends [[infer Item1, infer Item2]]
      ? [Item1[], Item2[]]
      : [R] extends [[infer Item11, infer Item22, infer Item3]]
      ? [Item11[], Item22[], Item3[]]
      : never;
    const result = (await this.query(sql, params, dbName)) as any[];
    return result as Multi<T>;
  }

  /**
   * Insert or Update rows in the database.
   */
  affect(sql: string, params?: any, dbName?: string) {
    return this.query(sql, params, dbName) as Promise<OkPacket>;
  }

  affectInTransaction(connection: PoolConnection, sql: string, params?: any) {
    return this.queryInTransaction(connection, sql, params) as Promise<OkPacket>;
  }

  protected handleErr(msg1: string, err: MysqlError, reject: (...args: any[]) => void) {
    let level: Level;
    if (err.fatal) {
      level = Level.fatal;
    } else {
      level = Level.error;
    }
    let status: number = Status.INTERNAL_SERVER_ERROR;
    if (!isNaN(parseFloat(err.sqlMessage || ''))) {
      let rawMsg: string;
      let rawStatus: string;
      [rawMsg, rawStatus] = err.sqlMessage!.split(',');
      msg1 = rawMsg || msg1;
      status = +rawStatus || status;
    }
    const detailErr = new CustomError({ msg1: msg1, level, status }, err);
    reject(detailErr);
  }
}
