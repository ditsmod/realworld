import { CorsModule } from '@holu/cors';
import { restModule } from '@holu/rest';
import { getParams, OasOptions } from '@holu/openapi';
import { TypeormModule } from '@holu/typeorm';

import { CommentEntity, ArticleEntity, UserEntity, FollowerEntity } from '#entities';
import { ParamsDto } from '#dto/params.dto.js';
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
      paratemers: getParams('path', true, ParamsDto, 'slug'),
    } as OasOptions,
  },
})
export class CommentsModule {}
