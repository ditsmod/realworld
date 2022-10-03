import { Module } from '@ditsmod/core';
import { CorsModule } from '@ditsmod/cors';
import { getParams, OasOptions } from '@ditsmod/openapi';

import { Params } from '@models/params';
import { CommentsController } from './comments.controller';
import { DbService } from './db.service';

@Module({
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
