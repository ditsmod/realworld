import { featureModule } from '@ditsmod/core';
import { CorsModule } from '@ditsmod/cors';
import { OasOptions } from '@ditsmod/openapi';

import { DbService } from './db.service.js';
import { TagsController } from './tags.controller.js';

@featureModule({
  imports: [CorsModule],
  controllers: [TagsController],
  providersPerReq: [DbService],
  extensionsMeta: {
    oasOptions: {
      tags: ['tags'],
    } as OasOptions,
  },
})
export class TagsModule {}
