import { Controller, pickProperties, Req, Res, Status, CustomError } from '@ditsmod/core';
import { OasRoute } from '@ditsmod/openapi';
import { DictService } from '@ditsmod/i18n';

import { Params } from '@models/params';
import { OasOperationObject } from '@utils/oas-helpers';
import { BearerGuard } from '@service/auth/bearer.guard';
import { UtilService } from '@service/util/util.service';
import { AuthService } from '@service/auth/auth.service';
import { AppConfigService } from '@service/app-config/config.service';
import { Permission } from '@shared';
import { ServerDict } from '@service/openapi-with-params/locales/current';
import { Article, ArticleItem, ArticlePostData, ArticlePutData, Articles, Author } from './models';
import { DbService } from './db.service';
import { ArticlesSelectParams, DbArticle } from './types';

@Controller()
export class ArticlesController {
  constructor(
    private req: Req,
    private res: Res,
    private authService: AuthService,
    private utils: UtilService,
    private db: DbService,
    private config: AppConfigService
  ) {}

  @OasRoute('GET', '', {
    ...new OasOperationObject()
      .setOptionalParams('query', Params, 'tag', 'author', 'favorited', 'limit', 'offset')
      .setResponse(Articles, 'Description for response content.')
      .getNotFoundResponse('The article not found.'),
  })
  async getLastArticles() {
    const { queryParams } = this.req;
    const articlesSelectParams: ArticlesSelectParams = {
      tag: queryParams.tag || '',
      author: queryParams.author || '',
      favorited: queryParams.favorited || '',
      offset: queryParams.offset || 0,
      limit: queryParams.limit || this.config.perPage,
    };
    const userId = await this.authService.getCurrentUserId();
    const { dbArticles, foundRows } = await this.db.getArticles(userId, articlesSelectParams);
    const articles = new Articles();
    articles.articles = dbArticles.map((dbArticle) => this.transformToArticleItem(dbArticle));
    articles.articlesCount = foundRows;
    this.res.sendJson(articles);
  }

  @OasRoute('GET', ':slug', {
    ...new OasOperationObject()
      .setOptionalParams('query', Params, 'tag', 'author', 'limit', 'offset')
      .setResponse(ArticleItem, 'Description for response content.')
      .setUnauthorizedResponse()
      .getNotFoundResponse('The article not found.'),
  })
  async getArticle() {
    // This need only because parameter `:slug` conflict with parameter `feed`.
    if (this.req.pathParams.slug == 'feed') {
      await this.fead();
    } else {
      await this.getArticleBySlug();
    }
  }

  private async fead() {
    const currentUserId = await this.authService.getCurrentUserId();
    if (currentUserId) {
      const { queryParams } = this.req;
      const offset: number = queryParams.offset || 0;
      const limit: number = queryParams.limit || this.config.perPage;
      const { dbArticles, foundRows } = await this.db.getArticlesByFeed(currentUserId, offset, limit);
      const articles = new Articles();
      articles.articles = dbArticles.map((dbArticle) => this.transformToArticleItem(dbArticle));
      articles.articlesCount = foundRows;
      this.res.sendJson(articles);
    } else {
      this.utils.throw401Error('jwt-token');
    }
  }

  async getArticleBySlug(slug?: string) {
    const currentUserId = await this.authService.getCurrentUserId();
    slug = slug || this.req.pathParams.slug;
    const dbArticle = await this.db.getArticleBySlug(slug!, currentUserId);
    if (!dbArticle) {
      this.utils.throw404Error('slug', 'The article not found.');
    }
    const article = this.transformToArticleItem(dbArticle);
    const articleItem = new ArticleItem();
    articleItem.article = article;
    this.res.sendJson(articleItem);
  }

  @OasRoute('POST', '', [BearerGuard], {
    ...new OasOperationObject()
      .setRequestBody(ArticlePostData, 'Description for requestBody.')
      .getResponse(ArticleItem, 'Description for response content.', Status.CREATED),
  })
  async postArticles() {
    const userId = this.req.jwtPayload.userId as number;
    const { article: articlePostData } = this.req.body as ArticlePostData;
    const slug = this.getSlug(articlePostData.title);

    const slugExists = await this.db.getArticleBySlug(slug!, 0);
    if (slugExists) {
      const dictService = this.req.injector.get(DictService) as DictService;
      const dict = dictService.getDictionary(ServerDict);
      throw new CustomError({
        msg1: dict.slugExists('slug', slug),
      });
    }

    const okPacket = await this.db.postArticle(userId, slug, articlePostData);
    const currentUserId = await this.authService.getCurrentUserId();
    const dbArticle = await this.db.getArticleById(okPacket.insertId, currentUserId);
    const article = this.transformToArticleItem(dbArticle);
    const articleItem = new ArticleItem();
    articleItem.article = article;
    this.res.sendJson(articleItem);
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

  @OasRoute('PUT', ':slug', [BearerGuard], {
    ...new OasOperationObject()
      .setRequestBody(ArticlePutData, 'Description for requestBody.')
      .getResponse(ArticleItem, 'Description for response content.'),
  })
  async putArticlesSlug() {
    const hasPermissions = await this.authService.hasPermissions([Permission.canEditAnyPost]);
    const currentUserId = await this.authService.getCurrentUserId();
    const oldSlug = this.req.pathParams.slug as string;
    const articlePutData = this.req.body as ArticlePutData;
    const newSlug = this.getSlug(articlePutData.article.title) || oldSlug;
    const okPacket = await this.db.putArticle(currentUserId, hasPermissions, oldSlug, newSlug, articlePutData.article);
    if (!okPacket.affectedRows) {
      this.utils.throw403Error('permissions', `You don't have permission to change this article.`);
    }

    await this.getArticleBySlug(newSlug);
  }

  @OasRoute('DELETE', ':slug', [BearerGuard], {
    ...new OasOperationObject().setUnprocessableEnryResponse().getResponse(),
  })
  async delArticlesSlug() {
    const hasPermissions = await this.authService.hasPermissions([Permission.canDeleteAnyPost]);
    const currentUserId = await this.authService.getCurrentUserId();
    const slug = this.req.pathParams.slug as string;
    const okPacket = await this.db.deleteArticle(currentUserId, hasPermissions, slug);
    if (!okPacket.affectedRows) {
      this.utils.throw403Error('permissions', `You don't have permission to delete this article.`);
    }

    this.res.sendJson({ ok: 1 });
  }
}
