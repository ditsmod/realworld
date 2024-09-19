import { createPool, Pool, PoolConnection } from 'mysql2';
import { injectable, AnyObj, InputLogLevel, Status, CustomError } from '@ditsmod/core';
import { DictService } from '@ditsmod/i18n';

import { ServerDict } from '../openapi-with-params/locales/current/index.js';
import { MySqlConfigService } from './mysql-config.service.js';

@injectable()
export class MysqlService {
  private pools: { [database: string]: Pool } = {};
  private dict: ServerDict;

  constructor(private config: MySqlConfigService, private dictService: DictService) {}

  getConnection(dbName?: string): Promise<PoolConnection> {
    if (!this.dict) {
      this.dict = this.dictService.getDictionary(ServerDict);
    }
    return new Promise((resolve, reject) => {
      const config = { ...this.config };
      const database = (dbName || config.database) as string;
      config.database = database;
      if (!this.pools[database]) {
        this.pools[database] = createPool(config);
      }

      this.pools[database].getConnection((err, connection) => {
        if (err) {
          this.handleErr(this.dict.mysqlConnect, err, reject);
        } else {
          resolve(connection);
        }
      });
    });
  }

  async query<T = AnyObj>(sql: string, params?: any, dbName?: string): Promise<any> {
    const connection = await this.getConnection(dbName);
    return new Promise((resolve, reject) => {
      connection.query(sql, params, (err, rows, fieldInfo) => {
        connection.release();
        if (err) {
          this.handleErr(this.dict.mysqlQuery, err, reject);
        } else {
          resolve({ rows, fieldInfo });
        }
      });
    });
  }

  async startTransaction(dbName?: string) {
    const connection = await this.getConnection(dbName);
    connection.beginTransaction((error) => null);
    return connection;
  }

  queryInTransaction<T = AnyObj>(connection: PoolConnection, sql: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      connection.query(sql, params, (err, rows, fieldInfo) => {
        if (err) {
          connection.rollback((error) => null);
          connection.release();
          this.handleErr(this.dict.mysqlQuery, err, reject);
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
          connection.rollback((error) => null);
          this.handleErr(this.dict.errMysqlCommit, err, reject);
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
    const sql2 = 'select found_rows() as foundRows;';
    const result2 = await this.queryInTransaction(poolConnection, sql2);
    await this.commit(poolConnection);
    const foundRows = (result2.rows as { foundRows: number }[])[0].foundRows;
    return { result, foundRows };
  }

  protected handleErr(msg1: string, err: NodeJS.ErrnoException, reject: (...args: any[]) => void) {
    let level: InputLogLevel;
    if (err.code == 'fatal') {
      level = 'fatal';
    } else {
      level = 'error';
    }
    let status: number = Status.INTERNAL_SERVER_ERROR;
    if (!isNaN(parseFloat(err.message || ''))) {
      const [rawMsg, rawStatus] = err.message!.split(',');
      msg1 = rawMsg || msg1;
      status = +rawStatus || status;
    }
    const detailErr = new CustomError({ msg1: msg1, level, status }, err);
    reject(detailErr);
  }
}
