import { restModule } from '@ditsmod/rest';

import { MySqlConfigService } from './mysql-config.service.js';
import { MysqlService } from './mysql.service.js';

@restModule({ providersPerApp: [MysqlService, MySqlConfigService] })
export class MysqlModule {}
