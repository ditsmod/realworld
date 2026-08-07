import { HttpStatus, optional, ctx } from '@holu/core';
import { controller, PATH_PARAMS, QUERY_PARAMS } from '@holu/rest';
import { oasRoute } from '@holu/openapi';
import { JWT_PAYLOAD } from '@holu/jwt';
import { HTTP_BODY } from '@holu/body-parser';

import { ParamsDto } from '#dto/params.dto.js';
import { OasOperationObject } from '#utils/oas-helpers.js';
import { BearerGuard, type JwtAuthPayload } from '#service/auth/bearer.guard.js';
import { ArticleItemDto, ArticlePostDto, ArticlePutDto, ArticlesDto } from './articles.dto.js';
import { ArticlesService } from './articles.service.js';
import type { ArticlesSelectParams } from './types.js';

@controller()
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @oasRoute('GET', '', {
    ...new OasOperationObject()
      .setOptionalParams('query', ParamsDto, 'tag', 'author', 'favorited', 'limit', 'offset')
      .setResponse(ArticlesDto, 'Description for response content.')
      .getNotFoundResponse('The article not found.'),
  })
  async getLastArticles(@optional() @ctx(QUERY_PARAMS) queryParams: Partial<ArticlesSelectParams> = {}) {
    return this.articlesService.getLastArticles(queryParams);
  }

  @oasRoute('GET', ':slug', {
    ...new OasOperationObject()
      .setRequiredParams('path', ParamsDto, 'slug')
      .setOptionalParams('query', ParamsDto, 'tag', 'author', 'limit', 'offset')
      .setResponse(ArticleItemDto, 'Description for response content.')
      .setUnauthorizedResponse()
      .getNotFoundResponse('The article not found.'),
  })
  async getArticle(
    @ctx(PATH_PARAMS) pathParams: Record<'slug', string>,
    @optional() @ctx(QUERY_PARAMS) queryParams: Partial<ArticlesSelectParams> = {}
  ) {
    if (pathParams.slug == 'feed') {
      return this.articlesService.getFeed(queryParams);
    } else {
      return this.articlesService.getArticleBySlug(pathParams.slug);
    }
  }

  @oasRoute('POST', '', [BearerGuard], {
    ...new OasOperationObject()
      .setRequestBody(ArticlePostDto, 'Description for requestBody.')
      .getResponse(ArticleItemDto, 'Description for response content.', HttpStatus.CREATED),
  })
  async postArticles(@ctx(JWT_PAYLOAD) jwtPayload: JwtAuthPayload, @ctx(HTTP_BODY) body: ArticlePostDto) {
    return this.articlesService.postArticle(jwtPayload.userId, body.article);
  }

  @oasRoute('PUT', ':slug', [BearerGuard], {
    ...new OasOperationObject()
      .setRequiredParams('path', ParamsDto, 'slug')
      .setRequestBody(ArticlePutDto, 'Description for requestBody.')
      .getResponse(ArticleItemDto, 'Description for response content.'),
  })
  async putArticlesSlug(
    @ctx(PATH_PARAMS) pathParams: Record<'slug', string>,
    @ctx(HTTP_BODY) articlePutData: ArticlePutDto
  ) {
    return this.articlesService.putArticle(pathParams.slug, articlePutData.article);
  }

  @oasRoute('DELETE', ':slug', [BearerGuard], {
    ...new OasOperationObject()
      .setRequiredParams('path', ParamsDto, 'slug')
      .setUnprocessableEntityResponse()
      .getResponse(),
  })
  async delArticlesSlug(@ctx(PATH_PARAMS) pathParams: Record<'slug', string>) {
    return this.articlesService.deleteArticle(pathParams.slug);
  }
}
