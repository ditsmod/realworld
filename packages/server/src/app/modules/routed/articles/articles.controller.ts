import { Controller, Req, Res, Status, edk } from '@ditsmod/core';
import { getParams, OasRoute } from '@ditsmod/openapi';

import { Params } from '@models/params';
import { getRequestBody, Responses } from '@utils/oas-helpers';
import { BearerGuard } from '@service/auth/bearer.guard';
import { UtilService } from '@service/util/util.service';
import { AuthService } from '@service/auth/auth.service';
import { Article, ArticleItem, ArticlePostData, Articles, Author } from './models';
import { DbService } from './db.service';
import { DbArticle } from './types';

@Controller()
export class ArticlesController {
  constructor(
    private req: Req,
    private res: Res,
    private authService: AuthService,
    private utils: UtilService,
    private db: DbService
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
    let offset: number = queryParams.offset || '';
    let limit: number = queryParams.limit || '';
    await this.db.getArticles({
      tag,
      author,
      favorited,
      offset,
      limit,
    });
    const form = new Articles();
    form.articlesCount = 2;
    form.articles = [new Article(), new Article()];
    this.res.sendJson(form);
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
      this.res.sendJson([new Article(), new Article()]);
    } else {
      this.utils.throw401Error('jwt-token');
    }
  }

  private async slug(slug?: string) {
    slug = slug || this.req.pathParams.slug;
    this.res.sendJson(new ArticleItem());
  }

  @OasRoute('POST', '', [BearerGuard], {
    ...getRequestBody(ArticlePostData, 'Description for requestBody.'),
    ...new Responses(ArticleItem, 'Description for response content.', Status.CREATED)
      .getUnprocessableEnryResponse(),
  })
  async postArticles() {
    const userId = this.req.jwtPayload.userId as number;
    const { article } = this.req.body as ArticlePostData;
    const slug = this.getSlug(article.title);
    const okPacket = await this.db.postArticles(userId, slug, article);
    const currentUserId = await this.authService.getCurrentUserId();
    const dbArticle = await this.db.getArticleById(okPacket.insertId, currentUserId);
    const articleItem = this.transformToArticleItem(dbArticle);
    this.res.sendJson(articleItem);
  }

  protected transformToArticleItem(dbArticle: DbArticle): ArticleItem {
    const author = edk.pickProperties(new Author(), dbArticle as Omit<DbArticle, 'following'>);
    author.following = dbArticle.following ? true : false;
    
    const article = edk.pickProperties(new Article(), dbArticle as Omit<DbArticle, 'favorited'>);
    article.author = author;
    article.favorited = dbArticle.favorited ? true : false;

    const articleItem = new ArticleItem();
    articleItem.article = article;
    return articleItem;
  }

  protected getSlug(title: string) {
    return title.toLocaleLowerCase().replace(/ /g, '-');
  }

  @OasRoute('PUT', ':slug', [BearerGuard], {
    ...getRequestBody(ArticlePostData, 'Description for requestBody.'),
    ...new Responses(ArticleItem, 'Description for response content.').getUnprocessableEnryResponse(),
  })
  async putArticlesSlug() {
    this.res.sendJson(new ArticleItem());
  }

  @OasRoute('DELETE', ':slug', [BearerGuard], {
    ...new Responses().getNoContentResponse(),
  })
  async delArticlesSlug() {
    this.res.sendJson(new ArticleItem());
  }
}
