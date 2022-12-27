import { featureModule } from '@ditsmod/core';

import { UtilService } from './util.service';

@featureModule({ providersPerApp: [UtilService] })
export class UtilModule {}
