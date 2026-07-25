import { restModule } from '@ditsmod/rest';
import { CorsModule } from '@ditsmod/cors';
import { OasOptions } from '@ditsmod/openapi';
import { TypeormModule } from '@ditsmod/typeorm';

import { Article, Tag, ArticleTag, User, Favorite, Follower } from '#app/entities/index.js';
import { ArticlesController } from './articles.controller.js';
import { CommentsModule } from './comments/comments.module.js';
import { DbService } from './db.service.js';
import { FavoriteModule } from './favorite/favorite.module.js';

@restModule({
  imports: [CorsModule, TypeormModule.forFeature([Article, Tag, ArticleTag, User, Favorite, Follower])],
  appends: [
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
