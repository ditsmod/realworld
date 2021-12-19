import { Module } from '@ditsmod/core';

import { MySqlConfigService } from './mysql-config.service';
import { MysqlService } from './mysql.service';

@Module({ providersPerApp: [MysqlService, MySqlConfigService] })
export class MysqlModule {}
