import { Module } from '@ditsmod/core';
import { getParams, OasOptions } from '@ditsmod/openapi';

import { Params } from '@models/params';
import { ArticlesController } from './articles.controller';
import { CommentsModule } from './comments/comments.module';
import { FavoriteModule } from './favorite/favorite.module';

@Module({
  imports: [
    { prefix: 'comments', module: CommentsModule },
    { prefix: 'favorite', module: FavoriteModule },
  ],
  controllers: [ArticlesController],
  extensionsMeta: {
    oasOptions: {
      tags: ['articles'],
      paratemers: getParams('path', true, Params, 'slug'),
    } as OasOptions,
  },
})
export class ArticlesModule {}
