import {
  controller,
  pickProperties,
  Status,
  CustomError,
  inject,
  PATH_PARAMS,
  QUERY_PARAMS,
  optional,
  Injector,
} from '@ditsmod/core';
import { oasRoute } from '@ditsmod/openapi';
import { DictService } from '@ditsmod/i18n';
import { JWT_PAYLOAD } from '@ditsmod/jwt';
import { HTTP_BODY } from '@ditsmod/body-parser';

import { Params } from '#models/params.js';
import { OasOperationObject } from '#utils/oas-helpers.js';
import { BearerGuard } from '#service/auth/bearer.guard.js';
import { UtilService } from '#service/util/util.service.js';
import { AuthService } from '#service/auth/auth.service.js';
import { AppConfigService } from '#service/app-config/config.service.js';
import { Permission } from '#shared';
import { ServerDict } from '#service/openapi-with-params/locales/current/index.js';
import { Article, ArticleItem, ArticlePostData, ArticlePutData, Articles, Author } from './models.js';
import { DbService } from './db.service.js';
import { ArticlesSelectParams, DbArticle } from './types.js';

@controller()
export class ArticlesController {
  constructor(private authService: AuthService, private utils: UtilService, private db: DbService) {}

  @oasRoute('GET', '', {
    ...new OasOperationObject()
      .setOptionalParams('query', Params, 'tag', 'author', 'favorited', 'limit', 'offset')
      .setResponse(Articles, 'Description for response content.')
      .getNotFoundResponse('The article not found.'),
  })
  async getLastArticles(config: AppConfigService, @optional() @inject(QUERY_PARAMS) queryParams: any = {}) {
    const articlesSelectParams: ArticlesSelectParams = {
      tag: queryParams.tag || '',
      author: queryParams.author || '',
      favorited: queryParams.favorited || '',
      offset: queryParams.offset || 0,
      limit: queryParams.limit || config.perPage,
    };
    const userId = await this.authService.getCurrentUserId();
    const { dbArticles, foundRows } = await this.db.getArticles(userId, articlesSelectParams);
    const articles = new Articles();
    articles.articles = dbArticles.map((dbArticle) => this.transformToArticleItem(dbArticle));
    articles.articlesCount = foundRows;
    return articles;
  }

  @oasRoute('GET', ':slug', {
    ...new OasOperationObject()
      .setRequiredParams('path', Params, 'slug')
      .setOptionalParams('query', Params, 'tag', 'author', 'limit', 'offset')
      .setResponse(ArticleItem, 'Description for response content.')
      .setUnauthorizedResponse()
      .getNotFoundResponse('The article not found.'),
  })
  async getArticle(
    config: AppConfigService,
    @inject(PATH_PARAMS) pathParams: any,
    @optional() @inject(QUERY_PARAMS) queryParams: any = {}
  ) {
    // This need only because parameter `:slug` conflict with parameter `feed`.
    if (pathParams.slug == 'feed') {
      return this.fead(config, queryParams);
    } else {
      return this.getArticleBySlug(pathParams);
    }
  }

  private async fead(config: AppConfigService, queryParams: any) {
    const currentUserId = await this.authService.getCurrentUserId();
    if (currentUserId) {
      const offset: number = queryParams.offset || 0;
      const limit: number = queryParams.limit || config.perPage;
      const { dbArticles, foundRows } = await this.db.getArticlesByFeed(currentUserId, offset, limit);
      const articles = new Articles();
      articles.articles = dbArticles.map((dbArticle) => this.transformToArticleItem(dbArticle));
      articles.articlesCount = foundRows;
      return articles;
    } else {
      return this.utils.throw401Error('jwt-token');
    }
  }

  async getArticleBySlug(pathParams: any, slug?: string) {
    const currentUserId = await this.authService.getCurrentUserId();
    slug = slug || pathParams.slug;
    const dbArticle = await this.db.getArticleBySlug(slug!, currentUserId);
    if (!dbArticle) {
      this.utils.throw404Error('slug', 'The article not found.');
    }
    const article = this.transformToArticleItem(dbArticle);
    const articleItem = new ArticleItem();
    articleItem.article = article;
    return articleItem;
  }

  @oasRoute('POST', '', [BearerGuard], {
    ...new OasOperationObject()
      .setRequestBody(ArticlePostData, 'Description for requestBody.')
      .getResponse(ArticleItem, 'Description for response content.', Status.CREATED),
  })
  async postArticles(
    injector: Injector,
    @inject(JWT_PAYLOAD) jwtPayload: any,
    @inject(HTTP_BODY) body: ArticlePostData
  ) {
    const userId = jwtPayload.userId as number;
    const { article: articlePostData } = body;
    const slug = this.getSlug(articlePostData.title);

    const slugExists = await this.db.getArticleBySlug(slug!, 0);
    if (slugExists) {
      const dictService = injector.get(DictService) as DictService;
      const dict = dictService.getDictionary(ServerDict);
      throw new CustomError({
        msg1: dict.slugExists('slug', slug),
      });
    }

    const insertResult = await this.db.postArticle(userId, slug, articlePostData);
    const currentUserId = await this.authService.getCurrentUserId();
    const dbArticle = await this.db.getArticleById(Number(insertResult.insertId), currentUserId);
    const article = this.transformToArticleItem(dbArticle!);
    const articleItem = new ArticleItem();
    articleItem.article = article;
    return articleItem;
  }

  protected transformToArticleItem(dbArticle: DbArticle): Article {
    dbArticle.createdAt = dbArticle.createdAt * 1000;
    dbArticle.updatedAt = dbArticle.updatedAt * 1000;

    const author = pickProperties(new Author(), dbArticle as Omit<DbArticle, 'following'>);
    author.following = dbArticle.following ? true : false;

    const article = pickProperties(
      new Article(),
      dbArticle as Omit<DbArticle, 'favorited' | 'createdAt' | 'updatedAt'>
    );
    article.author = author;
    article.createdAt = new Date(article.createdAt).toISOString();
    article.updatedAt = new Date(article.updatedAt).toISOString();
    article.favorited = dbArticle.favorited ? true : false;
    return article;
  }

  protected getSlug(title: string = '') {
    return title.toLocaleLowerCase().replace(/ /g, '-');
  }

  @oasRoute('PUT', ':slug', [BearerGuard], {
    ...new OasOperationObject()
      .setRequiredParams('path', Params, 'slug')
      .setRequestBody(ArticlePutData, 'Description for requestBody.')
      .getResponse(ArticleItem, 'Description for response content.'),
  })
  async putArticlesSlug(@inject(PATH_PARAMS) pathParams: any, @inject(HTTP_BODY) articlePutData: ArticlePutData) {
    const hasPermissions = await this.authService.hasPermissions([Permission.canEditAnyPost]);
    const currentUserId = await this.authService.getCurrentUserId();
    const oldSlug = pathParams.slug as string;
    const newSlug = this.getSlug(articlePutData.article.title) || oldSlug;
    const updateResult = await this.db.putArticle(
      currentUserId,
      hasPermissions,
      oldSlug,
      newSlug,
      articlePutData.article
    );
    if (!updateResult.affectedRows) {
      this.utils.throw403Error('permissions', "`You don't have permission to change this article.");
    }

    return this.getArticleBySlug(pathParams, newSlug);
  }

  @oasRoute('DELETE', ':slug', [BearerGuard], {
    ...new OasOperationObject().setRequiredParams('path', Params, 'slug').setUnprocessableEnryResponse().getResponse(),
  })
  async delArticlesSlug(@inject(PATH_PARAMS) pathParams: any) {
    const hasPermissions = await this.authService.hasPermissions([Permission.canDeleteAnyPost]);
    const currentUserId = await this.authService.getCurrentUserId();
    const slug = pathParams.slug as string;
    const resultSetHeader = await this.db.deleteArticle(currentUserId, hasPermissions, slug);
    if (!resultSetHeader.affectedRows) {
      this.utils.throw403Error('permissions', "You don't have permission to delete this article.");
    }

    return { ok: 1 };
  }
}
