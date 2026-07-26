import { HttpStatus, optional, ctx } from '@ditsmod/core';
import { controller, PATH_PARAMS, QUERY_PARAMS } from '@ditsmod/rest';
import { oasRoute } from '@ditsmod/openapi';
import { JWT_PAYLOAD } from '@ditsmod/jwt';
import { HTTP_BODY } from '@ditsmod/body-parser';

import { Params } from '#dto/params.dto.js';
import { OasOperationObject } from '#utils/oas-helpers.js';
import { BearerGuard } from '#service/auth/bearer.guard.js';
import { ArticleItem, ArticlePostData, ArticlePutData, Articles } from './articles.dto.js';
import { ArticlesService } from './articles.service.js';

@controller()
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @oasRoute('GET', '', {
    ...new OasOperationObject()
      .setOptionalParams('query', Params, 'tag', 'author', 'favorited', 'limit', 'offset')
      .setResponse(Articles, 'Description for response content.')
      .getNotFoundResponse('The article not found.'),
  })
  async getLastArticles(@optional() @ctx(QUERY_PARAMS) queryParams: any = {}) {
    return this.articlesService.getLastArticles(queryParams);
  }

  @oasRoute('GET', ':slug', {
    ...new OasOperationObject()
      .setRequiredParams('path', Params, 'slug')
      .setOptionalParams('query', Params, 'tag', 'author', 'limit', 'offset')
      .setResponse(ArticleItem, 'Description for response content.')
      .setUnauthorizedResponse()
      .getNotFoundResponse('The article not found.'),
  })
  async getArticle(@ctx(PATH_PARAMS) pathParams: any, @optional() @ctx(QUERY_PARAMS) queryParams: any = {}) {
    if (pathParams.slug == 'feed') {
      return this.articlesService.getFeed(queryParams);
    } else {
      return this.articlesService.getArticleBySlug(pathParams.slug as string);
    }
  }

  @oasRoute('POST', '', [BearerGuard], {
    ...new OasOperationObject()
      .setRequestBody(ArticlePostData, 'Description for requestBody.')
      .getResponse(ArticleItem, 'Description for response content.', HttpStatus.CREATED),
  })
  async postArticles(@ctx(JWT_PAYLOAD) jwtPayload: any, @ctx(HTTP_BODY) body: ArticlePostData) {
    return this.articlesService.postArticle(jwtPayload.userId as number, body.article);
  }

  @oasRoute('PUT', ':slug', [BearerGuard], {
    ...new OasOperationObject()
      .setRequiredParams('path', Params, 'slug')
      .setRequestBody(ArticlePutData, 'Description for requestBody.')
      .getResponse(ArticleItem, 'Description for response content.'),
  })
  async putArticlesSlug(@ctx(PATH_PARAMS) pathParams: any, @ctx(HTTP_BODY) articlePutData: ArticlePutData) {
    return this.articlesService.putArticle(pathParams.slug as string, articlePutData.article);
  }

  @oasRoute('DELETE', ':slug', [BearerGuard], {
    ...new OasOperationObject().setRequiredParams('path', Params, 'slug').setUnprocessableEnryResponse().getResponse(),
  })
  async delArticlesSlug(@ctx(PATH_PARAMS) pathParams: any) {
    return this.articlesService.deleteArticle(pathParams.slug as string);
  }
}
