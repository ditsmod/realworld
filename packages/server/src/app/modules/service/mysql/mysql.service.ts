import { createPool, FieldPacket, Pool, PoolConnection } from 'mysql2/promise';
import { injectable, AnyObj, InputLogLevel, Status, CustomError } from '@ditsmod/core';
import { DictService } from '@ditsmod/i18n';

import { ServerDict } from '../openapi-with-params/locales/current/index.js';
import { MySqlConfigService } from './mysql-config.service.js';

export interface QueryReturns<T> {
  rows: T;
  fieldPacket: FieldPacket[];
}

@injectable()
export class MysqlService {
  private pools: { [database: string]: Pool } = {};
  private dict: ServerDict;

  constructor(private config: MySqlConfigService, private dictService: DictService) {}

  getConnection(dbName?: string): Promise<PoolConnection> {
    if (!this.dict) {
      this.dict = this.dictService.getDictionary(ServerDict);
    }

    const config = { ...this.config };
    const database = (dbName || config.database) as string;
    config.database = database;
    if (!this.pools[database]) {
      this.pools[database] = createPool(config);
    }

    return this.pools[database].getConnection().catch((err) => {
      return this.handleErr(this.dict.mysqlConnect, err) as any;
    });
  }

  async query<T = AnyObj>(sql: string, params?: any, dbName?: string): Promise<QueryReturns<T>> {
    const connection = await this.getConnection(dbName);
    return connection
      .query(sql, params)
      .then(([rows, fieldPacket]) => {
        connection.release();
        return { rows, fieldPacket };
      })
      .catch((err) => {
        return this.handleErr(this.dict.mysqlConnect, err) as any;
      });
  }

  async startTransaction(dbName?: string) {
    const connection = await this.getConnection(dbName);
    await connection.beginTransaction();
    return connection;
  }

  queryInTransaction<T = AnyObj>(connection: PoolConnection, sql: string, params?: any): Promise<QueryReturns<T>> {
    return connection
      .query(sql, params)
      .then(([rows, fieldPacket]) => ({ rows, fieldPacket }))
      .catch(async (err) => {
        await connection.rollback();
        connection.release();
        return this.handleErr(this.dict.mysqlConnect, err) as any;
      });
  }

  commit(connection: PoolConnection): Promise<void> {
    return connection
      .commit()
      .then(() => connection.release())
      .catch(async (err) => {
        await connection.rollback();
        return this.handleErr(this.dict.mysqlConnect, err) as any;
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

  protected handleErr(msg1: string, err: NodeJS.ErrnoException) {
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
    throw detailErr;
  }
}
