import { CorsModule } from '@ditsmod/cors';
import { OasOptions } from '@ditsmod/openapi';
import { restModule } from '@ditsmod/rest';

import { DbService } from './db.service.js';
import { TagsController } from './tags.controller.js';

@restModule({
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
