import { ctx } from '@ditsmod/core';
import { controller, PATH_PARAMS } from '@ditsmod/rest';
import { oasRoute } from '@ditsmod/openapi';

import { BearerGuard } from '#service/auth/bearer.guard.js';
import { OasOperationObject } from '#utils/oas-helpers.js';
import { ArticleItem } from '../models.js';
import { FavoriteService } from './favorite.service.js';

@controller()
export class FavoriteController {
  constructor(
    private favoriteService: FavoriteService,
    @ctx(PATH_PARAMS) private pathParams: any
  ) {}

  @oasRoute('POST', '', [BearerGuard], {
    ...new OasOperationObject()
      .setResponse(ArticleItem, 'Description for response content.')
      .getUnprocessableEnryResponse(),
  })
  async postFavorite() {
    return this.favoriteService.favoriteArticle(this.pathParams.slug as string);
  }

  @oasRoute('DELETE', '', [BearerGuard], {
    ...new OasOperationObject().setNotFoundResponse().setNoContentResponse().getUnprocessableEnryResponse(),
  })
  async Unfavorite() {
    return this.favoriteService.unfavoriteArticle(this.pathParams.slug as string);
  }
}
