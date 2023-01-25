import { controller, inject, PATH_PARAMS } from '@ditsmod/core';
import { oasRoute } from '@ditsmod/openapi';

import { BearerGuard } from '@service/auth/bearer.guard';
import { OasOperationObject } from '@utils/oas-helpers';
import { AuthService } from '@service/auth/auth.service';
import { ArticleItem } from '../models';
import { ArticlesController } from '../articles.controller';
import { DbService } from './db.service';

@controller()
export class FavoriteController {
  constructor(
    private db: DbService,
    private authService: AuthService,
    private articlesController: ArticlesController,
    @inject(PATH_PARAMS) private pathParams: any
  ) {}

  @oasRoute('POST', '', [BearerGuard], {
    ...new OasOperationObject()
      .setResponse(ArticleItem, 'Description for response content.')
      .getUnprocessableEnryResponse(),
  })
  async postFavorite() {
    const slug = this.pathParams.slug as string;
    const userId = await this.authService.getCurrentUserId();
    await this.db.setArticleFaforite(userId, slug);
    return this.articlesController.getArticleBySlug(this.pathParams, slug);
  }

  @oasRoute('DELETE', '', [BearerGuard], {
    ...new OasOperationObject()
    .setNotFoundResponse()
    .setNoContentResponse()
    .getUnprocessableEnryResponse(),
  })
  async Unfavorite() {
    const slug = this.pathParams.slug as string;
    const userId = await this.authService.getCurrentUserId();
    await this.db.deleteArticleFaforite(userId, slug);
    return this.articlesController.getArticleBySlug(this.pathParams, slug);
  }
}
