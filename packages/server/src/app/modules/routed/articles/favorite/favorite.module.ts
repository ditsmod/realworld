import { restModule } from '@ditsmod/rest';
import { CorsModule } from '@ditsmod/cors';
import { getParams, OasOptions } from '@ditsmod/openapi';
import { TypeormModule } from '@ditsmod/typeorm';

import { ArticleEntity, ArticleTagEntity, FavoriteEntity, TagEntity } from '#app/entities/index.js';
import { Params } from '#models/params.js';
import { ArticlesService } from '../articles.service.js';
import { DbService as ArticleDbService } from '../db.service.js';
import { DbService } from './db.service.js';
import { FavoriteController } from './favorite.controller.js';
import { FavoriteService } from './favorite.service.js';

@restModule({
  imports: [CorsModule, TypeormModule.forFeature([FavoriteEntity, ArticleEntity, TagEntity, ArticleTagEntity])],
  controllers: [FavoriteController],
  providersPerReq: [DbService, FavoriteService, ArticlesService, ArticleDbService],
  extensionsMeta: {
    oasOptions: {
      tags: ['favorite'],
      paratemers: getParams('path', true, Params, 'slug'),
    } as OasOptions,
  },
})
export class FavoriteModule {}
