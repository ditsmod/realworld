import { Module } from '@ditsmod/core';
import { getParams, OasOptions } from '@ditsmod/openapi';

import { Params } from '@models/params';
import { CommentsController } from './comments.controller';
import { DbService } from './db.service';

@Module({
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
