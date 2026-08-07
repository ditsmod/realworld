import { CorsModule } from '@holu/cors';
import { OasOptions } from '@holu/openapi';
import { restModule } from '@holu/rest';
import { TypeormModule } from '@holu/typeorm';

import { TagEntity } from '#entities';
import { DbService } from './db.service.js';
import { TagsController } from './tags.controller.js';
import { TagsService } from './tags.service.js';

@restModule({
  imports: [CorsModule, TypeormModule.forFeature([TagEntity])],
  controllers: [TagsController],
  providersPerReq: [DbService, TagsService],
  extensionsMeta: {
    oasOptions: {
      tags: ['tags'],
    } as OasOptions,
  },
})
export class TagsModule {}
