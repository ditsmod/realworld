import * as path from 'path';
import { config } from 'dotenv';
import { PoolConnection } from 'mysql';
config({ path: path.resolve(__dirname + '../../../../../../.env') });

import { ServerDict } from '@service/i18n/server.dict';
import { MySqlConfigService } from './mysql-config.service';
import { MysqlService } from './mysql.service';


describe('MysqlService', () => {
  it('get connection for default database', async () => {
    const mysqlService = new MysqlService(new MySqlConfigService(), new ServerDict());
    let connection: PoolConnection;
    try {
      connection = await mysqlService.getConnection();
      connection.destroy();
    } catch (error: any) {
      expect(error.cause).toBeUndefined();
    }
  });

  it('select from default database', async () => {
    const mysqlService = new MysqlService(new MySqlConfigService(), new ServerDict());
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
