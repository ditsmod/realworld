import { restModule } from '@ditsmod/rest';

import { UtilService } from './util.service.js';

@restModule({ providersPerApp: [UtilService] })
export class UtilModule {}
