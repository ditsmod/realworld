import { createPool, Pool, PoolConnection, escape, ResultSetHeader } from 'mysql2';
import { injectable } from '@ditsmod/core';
import { AnyObj, InputLogLevel, Status, CustomError } from '@ditsmod/core';
import { DictService } from '@ditsmod/i18n';
import {
  MysqlInsertBuilder,
  MySqlSelectBuilder,
  MySqlUpdateBuilder,
  TableAndAlias,
  MySqlDeleteBuilder,
  ValuesBuilder,
} from '@ditsmod/sqb';

import { ServerDict } from '../openapi-with-params/locales/current/index.js';
import { MySqlConfigService } from './mysql-config.service.js';


export interface SelectRunOptions {
  first?: boolean;
}

export interface InsertRunOptions {
  insertId?: boolean;
}

type SelectCallback = (selectBuilder: MySqlSelectBuilder) => MySqlSelectBuilder;
type MySqlQuery = MySqlSelectBuilder | MysqlInsertBuilder | MySqlUpdateBuilder | MySqlDeleteBuilder;

@injectable()
export class MysqlService<Tables extends object, FromTable extends keyof Tables = keyof Tables> {
  private pools: { [database: string]: Pool } = {};
  private dict: ServerDict;
  #cache = new Map<any, AnyObj>();

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

  insertFromSet<K extends keyof Tables>(table: K, obj: Tables[K]) {
    return new MysqlInsertBuilder<Tables>()
      .$setEscape(escape)
      .$setRun<any, InsertRunOptions>(async (query, opts, ...args) => {
        const result = await this.newQuery(query, args);
        if (opts.insertId) {
          return (result as ResultSetHeader).insertId;
        } else {
          return result;
        }
      })
      .insertFromSet(table, obj as object);
  }

  insertFromSelect<K extends keyof Tables>(
    table: K,
    fields: Extract<keyof Tables[K], string>[],
    selectCallback: (selectBuilder: MySqlSelectBuilder<Tables>) => MySqlSelectBuilder<Tables>
  ) {
    return new MysqlInsertBuilder<Tables>()
      .$setEscape(escape)
      .$setRun<any, InsertRunOptions>(async (query, opts, ...args) => {
        const result = await this.newQuery(query, args);
        if (opts.insertId) {
          return (result as ResultSetHeader).insertId;
        } else {
          return result;
        }
      })
      .insertFromSelect(table, fields as any, selectCallback);
  }

  insertFromValues<K extends keyof Tables>(
    table: K,
    fields: (keyof Tables[K])[],
    values: (string | number)[][]
  ): MysqlInsertBuilder<Tables>;
  insertFromValues<K extends keyof Tables>(
    table: K,
    fields: (keyof Tables[K])[],
    valuesCallback: (valuesBuilder: ValuesBuilder) => ValuesBuilder
  ): MysqlInsertBuilder<Tables>;
  insertFromValues<K extends keyof Tables>(
    table: K,
    fields: (keyof Tables[K])[],
    arrayOrCallback: (string | number)[][] | ((valuesBuilder: ValuesBuilder) => ValuesBuilder)
  ) {
    return new MysqlInsertBuilder<Tables>()
      .$setEscape(escape)
      .$setRun<any, InsertRunOptions>(async (query, opts, ...args) => {
        const result = await this.newQuery(query, args);
        if (opts.insertId) {
          return (result as ResultSetHeader).insertId;
        } else {
          return result;
        }
      })
      .insertFromValues(table, fields as any, arrayOrCallback as any);
  }

  select(...fields: [string, ...string[]]) {
    return new MySqlSelectBuilder<Tables>()
      .$setEscape(escape)
      .$setRun<any, SelectRunOptions>(async (query, opts, ...args) => {
        const result = await this.newQuery(query, args);
        if (opts.first) {
          return result[0];
        } else {
          return result;
        }
      })
      .select(...fields);
  }

  update(alias: string, selectCallback: SelectCallback): MySqlUpdateBuilder<Tables>;
  update(table: TableAndAlias<keyof Tables>): MySqlUpdateBuilder<Tables>;
  update(tableOrAlias: string | TableAndAlias<keyof Tables>, selectCallback?: SelectCallback) {
    return new MySqlUpdateBuilder<Tables>()
      .$setEscape(escape)
      .$setRun<any, SelectRunOptions>((query, opts, ...args) => this.newQuery(query, args))
      .update(tableOrAlias as string, selectCallback!);
  }

  delete(...tables: string[]) {
    return new MySqlDeleteBuilder<Tables>()
      .$setEscape(escape)
      .$setRun<any, SelectRunOptions>(async (query, opts, ...args) => {
        const result = await this.newQuery(query, args);
        if (opts.first) {
          return result[0];
        } else {
          return result;
        }
      })
      .delete(...tables);
  }

  getQuery<T extends MySqlQuery>(makeQuery: (args?: any[]) => T, args: any[] = []): T {
    let query = this.#cache.get(makeQuery) as T;
    if (query) {
      return query;
    }
    query = makeQuery(args);
    this.#cache.set(makeQuery, query);
    return query;
  }

  async newQuery<T = any>(sql: string, params?: any, dbName?: string): Promise<T> {
    const connection = await this.getConnection(dbName);
    return new Promise((resolve, reject) => {
      connection.query(sql, params, (err, rows) => {
        connection.release();
        if (err) {
          this.handleErr(this.dict.mysqlQuery, err, reject);
        } else {
          resolve(rows as T);
        }
      });
    });
  }

  async query(sql: string, params?: any, dbName?: string): Promise<any> {
    const connection = await this.getConnection(dbName);
    return new Promise((resolve, reject) => {
      connection.query(sql, params, (err, rows, fieldPacket) => {
        connection.release();
        if (err) {
          this.handleErr(this.dict.mysqlQuery, err, reject);
        } else {
          resolve({ rows, fieldPacket });
        }
      });
    });
  }

  async startTransaction(dbName?: string) {
    const connection = await this.getConnection(dbName);
    connection.beginTransaction(() => null);
    return connection;
  }

  queryInTransaction<T = AnyObj>(connection: PoolConnection, sql: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      connection.query(sql, params, (err, rows, fieldPacket) => {
        if (err) {
          connection.rollback(() => null);
          connection.release();
          this.handleErr(this.dict.mysqlQuery, err, reject);
        } else {
          resolve({ rows, fieldPacket });
        }
      });
    });
  }

  commit(connection: PoolConnection): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.commit((err) => {
        if (err) {
          connection.rollback(() => null);
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
    const sql2 = `select found_rows() as foundRows;`;
    const result2 = await this.queryInTransaction(poolConnection, sql2);
    this.commit(poolConnection);
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
