import { featureModule } from '@holu/core';

import { AppConfigService } from './config.service.js';

@featureModule({
  providersPerApp: [AppConfigService],
})
export class ConfigModule {}
