import { restModule } from '@ditsmod/rest';

import { AppConfigService } from './config.service.js';

@restModule({
  providersPerApp: [AppConfigService]
})
export class ConfigModule {}