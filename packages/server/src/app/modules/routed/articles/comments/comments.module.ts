import { CorsModule } from '@ditsmod/cors';
import { restModule } from '@ditsmod/rest';
import { getParams, OasOptions } from '@ditsmod/openapi';

import { Params } from '#models/params.js';
import { CommentsController } from './comments.controller.js';
import { DbService } from './db.service.js';

@restModule({
  imports: [CorsModule],
  controllers: [CommentsController],
  providersPerReq: [DbService],
  extensionsMeta: {
    oasOptions: {
      tags: ['comments'],
      paratemers: getParams('path', true, Params, 'slug'),
    } as OasOptions,
  },
})
export class CommentsModule {}
