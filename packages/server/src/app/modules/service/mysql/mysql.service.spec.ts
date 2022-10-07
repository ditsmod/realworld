import * as path from 'path';
import { config } from 'dotenv';
import { PoolConnection } from 'mysql';
import { describe, it, expect }  from '@jest/globals';

config({ path: path.resolve(__dirname + '../../../../../../.env') });

import { MySqlConfigService } from './mysql-config.service';
import { MysqlService } from './mysql.service';


describe('MysqlService', () => {
  const dictService = {
    getDictionary() {
      return {};
    }
  };

  it('get connection for default database', async () => {
    const mysqlService = new MysqlService(new MySqlConfigService(), dictService as any);
    let connection: PoolConnection;
    try {
      connection = await mysqlService.getConnection();
      connection.destroy();
    } catch (error: any) {
      expect(error.cause).toBeUndefined();
    }
  });

  it('select from default database', async () => {
    const mysqlService = new MysqlService(new MySqlConfigService(), dictService as any);
    let connection: PoolConnection;
    try {
      const result = await mysqlService.query('select 1 as fieldOne;');
      expect(result).toEqual([{ fieldOne: 1 }]);
    } catch (error: any) {
      expect(error.cause).toBeUndefined();
    } finally {
      connection = await mysqlService.getConnection();
      connection.destroy();
    }
  });
});
