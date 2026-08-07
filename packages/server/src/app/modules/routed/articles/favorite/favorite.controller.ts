import { ctx } from '@holu/core';
import { controller, PATH_PARAMS } from '@holu/rest';
import { oasRoute } from '@holu/openapi';

import { BearerGuard } from '#service/auth/bearer.guard.js';
import { OasOperationObject } from '#utils/oas-helpers.js';
import { ArticleItemDto } from '../articles.dto.js';
import { FavoriteService } from './favorite.service.js';

@controller()
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  @oasRoute('POST', '', [BearerGuard], {
    ...new OasOperationObject()
      .setResponse(ArticleItemDto, 'Description for response content.')
      .getUnprocessableEntityResponse(),
  })
  async postFavorite(@ctx(PATH_PARAMS) pathParams: Record<'slug', string>) {
    return this.favoriteService.favoriteArticle(pathParams.slug);
  }

  @oasRoute('DELETE', '', [BearerGuard], {
    ...new OasOperationObject().setNotFoundResponse().setNoContentResponse().getUnprocessableEntityResponse(),
  })
  async unfavorite(@ctx(PATH_PARAMS) pathParams: Record<'slug', string>) {
    return this.favoriteService.unfavoriteArticle(pathParams.slug);
  }
}
