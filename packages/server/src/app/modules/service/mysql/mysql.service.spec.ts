import * as path from 'path';
require('dotenv').config({path: path.resolve(__dirname + '../../../../../../.env')});
import { PoolConnection } from 'mysql';

import { ServerMsg } from '@service/msg/server-msg';
import { MySqlConfigService } from './mysql-config.service';
import { MysqlService } from './mysql.service';

describe('MysqlService', () => {
  it('get connection for default database', async () => {
    const mysqlService = new MysqlService(new MySqlConfigService(), new ServerMsg());
    let connection: PoolConnection;
    try {
      connection = await mysqlService.getConnection();
      connection.destroy();
    } catch (error: any) {
      expect(error.cause).toBeUndefined();
    }
  });

  it('select from default database', async () => {
    const mysqlService = new MysqlService(new MySqlConfigService(), new ServerMsg());
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
