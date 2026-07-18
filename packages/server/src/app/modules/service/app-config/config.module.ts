import { featureModule } from '@ditsmod/core';

import { AppConfigService } from './config.service.js';

@featureModule({
  providersPerApp: [AppConfigService]
})
export class ConfigModule {}