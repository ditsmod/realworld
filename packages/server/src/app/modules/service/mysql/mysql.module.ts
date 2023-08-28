import { featureModule } from '@ditsmod/core';

import { MySqlConfigService } from './mysql-config.service.js';
import { MysqlService } from './mysql.service.js';

@featureModule({ providersPerApp: [MysqlService, MySqlConfigService] })
export class MysqlModule {}
