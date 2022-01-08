import { createPool, Pool, PoolConnection, MysqlError, OkPacket, FieldInfo } from 'mysql';
import { Injectable } from '@ts-stack/di';
import { Level } from '@ditsmod/logger';
import { AnyObj, Status } from '@ditsmod/core';

import { ServerMsg } from '@service/msg/server-msg';
import { CustomError } from '@service/error-handler/custom-error';
import { MySqlConfigService } from './mysql-config.service';

@Injectable()
export class MysqlService {
  private pools: { [database: string]: Pool } = {};

  constructor(private config: MySqlConfigService, private serverMsg: ServerMsg) {}

  getConnection(dbName?: string): Promise<PoolConnection> {
    return new Promise((resolve, reject) => {
      const config = { ...this.config };
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

  async query<T = AnyObj>(
    sql: string,
    params?: any,
    dbName?: string
  ): Promise<{ rows: T[] | [T[], OkPacket] | OkPacket; fieldInfo?: FieldInfo[] }> {
    const connection = await this.getConnection(dbName);
    return new Promise((resolve, reject) => {
      connection.query(sql, params, (err, rows, fieldInfo) => {
        connection.release();
        if (err) {
          this.handleErr(this.serverMsg.mysqlQuery, err, reject);
        } else {
          resolve({ rows, fieldInfo });
        }
      });
    });
  }

  async startTransaction(dbName?: string) {
    const connection = await this.getConnection(dbName);
    connection.beginTransaction();
    return connection;
  }

  queryInTransaction<T = AnyObj>(
    connection: PoolConnection,
    sql: string,
    params?: any
  ): Promise<{ rows: T[] | [T[], OkPacket] | OkPacket; fieldInfo?: FieldInfo[] }> {
    return new Promise((resolve, reject) => {
      connection.query(sql, params, (err, rows, fieldInfo) => {
        if (err) {
          connection.rollback();
          connection.release();
          this.handleErr(this.serverMsg.mysqlQuery, err, reject);
        } else {
          resolve({ rows, fieldInfo });
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

  /**
   * If your select used `SQL_CALC_FOUND_ROWS`, you can use this method to get results for
   * this select and select with `found_rows()` function.
   */
  async queryWithFoundRows(sql1: string, params?: any) {
    const poolConnection = await this.startTransaction();
    const result = await this.queryInTransaction(poolConnection, sql1, params);
    const sql2 = `select found_rows() as foundRows;`;
    const result2 = await this.queryInTransaction(poolConnection, sql2);
    this.commit(poolConnection);
    const foundRows = (result2.rows as { foundRows: number }[])[0].foundRows;
    return { result, foundRows };
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
      const [rawMsg, rawStatus] = err.sqlMessage!.split(',');
      msg1 = rawMsg || msg1;
      status = +rawStatus || status;
    }
    const detailErr = new CustomError({ msg1: msg1, level, status }, err);
    reject(detailErr);
  }
}
