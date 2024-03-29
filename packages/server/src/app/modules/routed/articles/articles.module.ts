import { featureModule } from '@ditsmod/core';
import { CorsModule } from '@ditsmod/cors';
import { OasOptions } from '@ditsmod/openapi';

import { ArticlesController } from './articles.controller.js';
import { CommentsModule } from './comments/comments.module.js';
import { DbService } from './db.service.js';
import { FavoriteModule } from './favorite/favorite.module.js';

@featureModule({
  imports: [CorsModule],
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
