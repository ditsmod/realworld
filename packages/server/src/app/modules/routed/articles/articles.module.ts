import { Module } from '@ditsmod/core';
import { CorsModule } from '@ditsmod/cors';
import { OasOptions } from '@ditsmod/openapi';

import { ArticlesController } from './articles.controller';
import { CommentsModule } from './comments/comments.module';
import { DbService } from './db.service';
import { FavoriteModule } from './favorite/favorite.module';

@Module({
  imports: [
    CorsModule,
    { path: 'comments', module: CommentsModule },
    { path: 'favorite', module: FavoriteModule },
  ],
  controllers: [ArticlesController],
  providersPerReq: [DbService],
  extensionsMeta: {
    oasOptions: {
      tags: ['articles'],
    } as OasOptions,
  },
})
export class ArticlesModule {}
