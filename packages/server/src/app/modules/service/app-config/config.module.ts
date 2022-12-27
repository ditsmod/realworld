import { featureModule } from '@ditsmod/core';

import { AppConfigService } from './config.service';

@featureModule({
  providersPerApp: [AppConfigService]
})
export class ConfigModule {}