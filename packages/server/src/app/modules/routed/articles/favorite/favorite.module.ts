import { featureModule } from '@ditsmod/core';
import { CorsModule } from '@ditsmod/cors';
import { getParams, OasOptions } from '@ditsmod/openapi';

import { Params } from '@models/params';
import { ArticlesController } from '../articles.controller';
import { DbService as ArticleDbService } from '../db.service';
import { DbService } from './db.service';
import { FavoriteController } from './favorite.controller';

@featureModule({
  imports: [CorsModule],
  controllers: [FavoriteController],
  providersPerReq: [DbService, ArticlesController, ArticleDbService],
  extensionsMeta: {
    oasOptions: {
      tags: ['favorite'],
      paratemers: getParams('path', true, Params, 'slug'),
    } as OasOptions,
  },
})
export class FavoriteModule {}