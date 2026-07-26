import { restModule } from '@ditsmod/rest';
import { CorsModule } from '@ditsmod/cors';
import { getParams, OasOptions } from '@ditsmod/openapi';
import { TypeormModule } from '@ditsmod/typeorm';

import { ArticleEntity, ArticleTagEntity, FavoriteEntity, TagEntity, UserEntity, FollowerEntity } from '#entities';
import { ParamsDto } from '#dto/params.dto.js';
import { ArticlesService } from '../articles.service.js';
import { DbService as ArticleDbService } from '../db.service.js';
import { DbService } from './db.service.js';
import { FavoriteController } from './favorite.controller.js';
import { FavoriteService } from './favorite.service.js';

@restModule({
  imports: [
    CorsModule,
    TypeormModule.forFeature([FavoriteEntity, ArticleEntity, TagEntity, ArticleTagEntity, UserEntity, FollowerEntity]),
  ],
  controllers: [FavoriteController],
  providersPerReq: [DbService, FavoriteService, ArticlesService, ArticleDbService],
  extensionsMeta: {
    oasOptions: {
      tags: ['favorite'],
      paratemers: getParams('path', true, ParamsDto, 'slug'),
    } as OasOptions,
  },
})
export class FavoriteModule {}
