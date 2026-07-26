import { CorsModule } from '@ditsmod/cors';
import { restModule } from '@ditsmod/rest';
import { getParams, OasOptions } from '@ditsmod/openapi';
import { TypeormModule } from '@ditsmod/typeorm';

import { CommentEntity, ArticleEntity, UserEntity, FollowerEntity } from '#app/entities/index.js';
import { Params } from '#dto/params.dto.js';
import { CommentsController } from './comments.controller.js';
import { CommentsService } from './comments.service.js';
import { DbService } from './db.service.js';

@restModule({
  imports: [CorsModule, TypeormModule.forFeature([CommentEntity, ArticleEntity, UserEntity, FollowerEntity])],
  controllers: [CommentsController],
  providersPerReq: [DbService, CommentsService],
  extensionsMeta: {
    oasOptions: {
      tags: ['comments'],
      paratemers: getParams('path', true, Params, 'slug'),
    } as OasOptions,
  },
})
export class CommentsModule {}
