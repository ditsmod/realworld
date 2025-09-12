import { featureModule } from '@ditsmod/core';
import { CorsModule } from '@ditsmod/cors';
import { OasOptions } from '@ditsmod/openapi';
import { initRest } from '@ditsmod/rest';

import { DbService } from './db.service.js';
import { ProfilesController } from './profiles.controller.js';

@initRest({
  imports: [CorsModule],
  controllers: [ProfilesController],
  providersPerReq: [DbService],
  extensionsMeta: { oasOptions: { tags: ['profiles'] } as OasOptions },
})
@featureModule()
export class ProfilesModule {}