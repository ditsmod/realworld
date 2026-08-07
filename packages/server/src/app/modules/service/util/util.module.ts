import { featureModule } from '@holu/core';
import { UtilService } from './util.service.js';

@featureModule({ providersPerApp: [UtilService] })
export class UtilModule {}
