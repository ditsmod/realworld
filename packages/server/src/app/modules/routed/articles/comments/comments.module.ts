import { featureModule } from '@ditsmod/core';
import { CorsModule } from '@ditsmod/cors';
import { initRest } from '@ditsmod/rest';
import { getParams, OasOptions } from '@ditsmod/openapi';

import { Params } from '#models/params.js';
import { CommentsController } from './comments.controller.js';
import { DbService } from './db.service.js';

@initRest({
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
@featureModule()
export class CommentsModule {}
