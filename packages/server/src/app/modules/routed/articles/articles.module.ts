import { restModule } from '@holu/rest';
import { CorsModule } from '@holu/cors';
import { OasOptions } from '@holu/openapi';
import { TypeormModule } from '@holu/typeorm';

import { ArticleEntity, TagEntity, ArticleTagEntity, UserEntity, FavoriteEntity, FollowerEntity } from '#entities';
import { ArticlesController } from './articles.controller.js';
import { ArticlesService } from './articles.service.js';
import { CommentsModule } from './comments/comments.module.js';
import { DbService } from './db.service.js';
import { FavoriteModule } from './favorite/favorite.module.js';

@restModule({
  imports: [
    CorsModule,
    TypeormModule.forFeature([ArticleEntity, TagEntity, ArticleTagEntity, UserEntity, FavoriteEntity, FollowerEntity]),
  ],
  appends: [
    { path: 'comments', module: CommentsModule },
    { path: 'favorite', module: FavoriteModule },
  ],
  controllers: [ArticlesController],
  providersPerReq: [DbService, ArticlesService],
  extensionsMeta: {
    oasOptions: {
      tags: ['articles'],
    } as OasOptions,
  },
})
export class ArticlesModule {}
