import { featureModule } from '@ditsmod/core';
import { CorsModule } from '@ditsmod/cors';
import { OasOptions } from '@ditsmod/openapi';

import { DbService } from './db.service.js';
import { ProfilesController } from './profiles.controller.js';

@featureModule({
  imports: [CorsModule],
  controllers: [ProfilesController],
  providersPerReq: [DbService],
  extensionsMeta: { oasOptions: { tags: ['profiles'] } as OasOptions },
})
export class ProfilesModule {}