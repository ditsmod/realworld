import { Module } from '@ditsmod/core';
import { getParams, OasOptions } from '@ditsmod/openapi';

import { Params } from '@models/params';
import { CommentsController } from './comments.controller';

@Module({
  controllers: [CommentsController],
  extensionsMeta: {
    oasOptions: {
      tags: ['comments'],
      paratemers: getParams('path', true, Params, 'slug'),
    } as OasOptions,
  },
})
export class CommentsModule {}
