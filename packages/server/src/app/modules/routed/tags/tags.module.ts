import { featureModule } from '@ditsmod/core';
import { CorsModule } from '@ditsmod/cors';
import { OasOptions } from '@ditsmod/openapi';
import { initRest } from '@ditsmod/rest';

import { DbService } from './db.service.js';
import { TagsController } from './tags.controller.js';

@initRest({
  imports: [CorsModule],
  controllers: [TagsController],
  providersPerReq: [DbService],
  extensionsMeta: {
    oasOptions: {
      tags: ['tags'],
    } as OasOptions,
  },
})
@featureModule()
export class TagsModule {}
