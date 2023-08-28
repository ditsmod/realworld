import { featureModule } from '@ditsmod/core';

import { UtilService } from './util.service.js';

@featureModule({ providersPerApp: [UtilService] })
export class UtilModule {}
