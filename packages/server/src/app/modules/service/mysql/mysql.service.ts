import { createPool, Pool } from 'mysql2';
import { injectable } from '@ditsmod/core';
import { LogLevel, Status, CustomError } from '@ditsmod/core';
import { Kysely, MysqlDialect } from 'kysely';

import { MySqlConfigService } from './mysql-config.service';

@injectable()
export class MysqlService {
  #pools: { [database: string]: Pool } = {};
  #kyselys: { [database: string]: Kysely<any> } = {};

  constructor(private config: MySqlConfigService) {}

  protected async getPool(dbName?: string) {
    const config = { ...this.config };
    const database = (dbName || config.database) as string;
    config.database = database;
    if (!this.#pools[database]) {
      this.#pools[database] = createPool(config);
    }
    return this.#pools[database];
  }

  async getKysely<T extends object = any>(dbName?: string): Promise<Kysely<T>> {
    const pool = await this.getPool(dbName);
    const database = (dbName || this.config.database) as string;

    if (!this.#kyselys[database]) {
      this.#kyselys[database] = new Kysely({ dialect: new MysqlDialect({ pool }) });
    }
    return this.#kyselys[database];
  }

  protected async handleErr(msg1: string, err: NodeJS.ErrnoException, reject: (...args: any[]) => void) {
    let level: LogLevel;

    // @todo Investigate what codes can be here.
    if (err.code == 'unknown') {
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
