import { CorsModule } from '@ditsmod/cors';
import { OasOptions } from '@ditsmod/openapi';
import { restModule } from '@ditsmod/rest';
import { TypeormModule } from '@ditsmod/typeorm';

import { TagEntity } from '#app/entities/index.js';
import { DbService } from './db.service.js';
import { TagsController } from './tags.controller.js';

@restModule({
  imports: [CorsModule, TypeormModule.forFeature([TagEntity])],
  controllers: [TagsController],
  providersPerReq: [DbService],
  extensionsMeta: {
    oasOptions: {
      tags: ['tags'],
    } as OasOptions,
  },
})
export class TagsModule {}
