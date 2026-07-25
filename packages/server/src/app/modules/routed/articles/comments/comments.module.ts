import { CorsModule } from '@ditsmod/cors';
import { restModule } from '@ditsmod/rest';
import { getParams, OasOptions } from '@ditsmod/openapi';
import { TypeormModule } from '@ditsmod/typeorm';

import { Comment, Article, User, Follower } from '#app/entities/index.js';
import { Params } from '#models/params.js';
import { CommentsController } from './comments.controller.js';
import { DbService } from './db.service.js';

@restModule({
  imports: [CorsModule, TypeormModule.forFeature([Comment, Article, User, Follower])],
  controllers: [CommentsController],
  providersPerReq: [DbService],
  extensionsMeta: {
    oasOptions: {
      tags: ['comments'],
      paratemers: getParams('path', true, Params, 'slug'),
    } as OasOptions,
  },
})
export class CommentsModule {}
