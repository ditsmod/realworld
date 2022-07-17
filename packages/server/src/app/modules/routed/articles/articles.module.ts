import { Module } from '@ditsmod/core';
import { getParams, OasOptions } from '@ditsmod/openapi';

import { Params } from '@models/params';
import { ArticlesController } from './articles.controller';
import { CommentsModule } from './comments/comments.module';
import { DbService } from './db.service';
import { FavoriteModule } from './favorite/favorite.module';

@Module({
  imports: [
    { path: 'comments', module: CommentsModule },
    { path: 'favorite', module: FavoriteModule },
  ],
  controllers: [ArticlesController],
  providersPerReq: [DbService],
  extensionsMeta: {
    oasOptions: {
      tags: ['articles'],
      paratemers: getParams('path', true, Params, 'slug'),
    } as OasOptions,
  },
})
export class ArticlesModule {}
