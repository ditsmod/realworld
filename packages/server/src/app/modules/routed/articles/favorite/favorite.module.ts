import { Module } from '@ditsmod/core';
import { getParams, OasOptions } from '@ditsmod/openapi';

import { Params } from '@models/params';
import { FavoriteController } from './favorite.controller';

@Module({
  controllers: [FavoriteController],
  extensionsMeta: {
    oasOptions: {
      tags: ['favorite'],
      paratemers: getParams('path', true, Params, 'slug'),
    } as OasOptions,
  },
})
export class FavoriteModule {}