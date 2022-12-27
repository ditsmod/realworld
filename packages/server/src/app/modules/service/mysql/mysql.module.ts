import { featureModule } from '@ditsmod/core';

import { MySqlConfigService } from './mysql-config.service';
import { MysqlService } from './mysql.service';

@featureModule({ providersPerApp: [MysqlService, MySqlConfigService] })
export class MysqlModule {}
