import { Controller, Req, Res, Status, edk } from '@ditsmod/core';
import { getParams, OasRoute } from '@ditsmod/openapi';

import { Params } from '@models/params';
import { getRequestBody, Responses } from '@utils/oas-helpers';
import { BearerGuard } from '@service/auth/bearer.guard';
import { UtilService } from '@service/util/util.service';
import { AuthService } from '@service/auth/auth.service';
import { AppConfigService } from '@service/app-config/config.service';
import { Permission } from '@shared';
import { CustomError } from '@service/error-handler/custom-error';
import { ServerMsg } from '@service/msg/server-msg';
import { Article, ArticleItem, ArticlePostData, ArticlePutData, Articles, Author } from './models';
import { DbService } from './db.service';
import { DbArticle } from './types';

@Controller()
export class ArticlesController {
  constructor(
    private req: Req,
    private res: Res,
    private authService: AuthService,
    private utils: UtilService,
    private db: DbService,
    private config: AppConfigService,
    private serverMsg: ServerMsg
  ) {}

  @OasRoute('GET', '', [], {
    parameters: getParams('query', false, Params, 'tag', 'author', 'favorited', 'limit', 'offset'),
    ...new Responses(Articles, 'Description for response content.')
      .setNotFoundResponse('The article not found.')
      .getUnprocessableEnryResponse(),
  })
  async getArticles() {
    const { queryParams } = this.req;
    let tag: string = queryParams.tag || '';
    let author: string = queryParams.author || '';
    let favorited: string = queryParams.favorited || '';
    let offset: number = queryParams.offset || 0;
    let limit: number = queryParams.limit || this.config.perPage;
    const userId = await this.authService.getCurrentUserId();
    const { dbArticles, foundRows } = await this.db.getArticles(userId, {
      tag,
      author,
      favorited,
      offset,
      limit,
    });
    const articles = new Articles();
    articles.articles = dbArticles.map((dbArticle) => this.transformToArticleItem(dbArticle));
    articles.articlesCount = foundRows;
    this.res.sendJson(articles);
  }

  @OasRoute('GET', ':slug', [], {
    parameters: getParams('query', false, Params, 'tag', 'author', 'limit', 'offset'),
    ...new Responses(ArticleItem, 'Description for response content.')
      .setUnauthorizedResponse()
      .setNotFoundResponse('The article not found.')
      .getUnprocessableEnryResponse(),
  })
  async getArticlesSlug() {
    // This need only because parameter `:slug` conflict with parameter `feed`.
    if (this.req.pathParams.slug == 'feed') {
      await this.fead();
    } else {
      await this.slug();
    }
  }

  private async fead() {
    const currentUserId = await this.authService.getCurrentUserId();
    if (currentUserId) {
      const { queryParams } = this.req;
      let offset: number = queryParams.offset || 0;
      let limit: number = queryParams.limit || this.config.perPage;
      const { dbArticles, foundRows } = await this.db.getArticlesByFeed(currentUserId, offset, limit);
      const articles = new Articles();
      articles.articles = dbArticles.map((dbArticle) => this.transformToArticleItem(dbArticle));
      articles.articlesCount = foundRows;
      this.res.sendJson(articles);
    } else {
      this.utils.throw401Error('jwt-token');
    }
  }

  private async slug(slug?: string) {
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
    ...getRequestBody(ArticlePostData, 'Description for requestBody.'),
    ...new Responses(ArticleItem, 'Description for response content.', Status.CREATED).getUnprocessableEnryResponse(),
  })
  async postArticles() {
    const userId = this.req.jwtPayload.userId as number;
    const { article: articlePostData } = this.req.body as ArticlePostData;
    const slug = this.getSlug(articlePostData.title);

    const slugExists = await this.db.getArticleBySlug(slug!, 0);
    if (slugExists) {
      throw new CustomError({ msg1: this.serverMsg.slugExists, args1: ['slug', slug] });
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
    const author = edk.pickProperties(new Author(), dbArticle as Omit<DbArticle, 'following'>);
    author.following = dbArticle.following ? true : false;

    const article = edk.pickProperties(new Article(), dbArticle as Omit<DbArticle, 'favorited'>);
    article.author = author;
    article.favorited = dbArticle.favorited ? true : false;
    return article;
  }

  protected getSlug(title: string = '') {
    return title.toLocaleLowerCase().replace(/ /g, '-');
  }

  @OasRoute('PUT', ':slug', [BearerGuard], {
    ...getRequestBody(ArticlePutData, 'Description for requestBody.'),
    ...new Responses(ArticleItem, 'Description for response content.').getUnprocessableEnryResponse(),
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

    await this.slug(newSlug);
  }

  @OasRoute('DELETE', ':slug', [BearerGuard], {
    ...new Responses().getNoContentResponse(),
  })
  async delArticlesSlug() {
    this.res.sendJson(new ArticleItem());
  }
}
