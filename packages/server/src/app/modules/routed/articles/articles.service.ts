import { pickProperties, injectable, Injector } from '@ditsmod/core';
import { CustomError } from '@ditsmod/core/errors';
import { DictService } from '@ditsmod/i18n';

import { AuthService } from '#service/auth/auth.service.js';
import { UtilService } from '#service/util/util.service.js';
import { AppConfigService } from '#service/app-config/config.service.js';
import { Permission } from '#shared';
import { ServerDict } from '#service/openapi-with-params/locales/current/index.js';
import { ArticleDto, ArticleItemDto, ArticlePostDto, ArticlePutDto, ArticlesDto, AuthorDto } from './articles.dto.js';
import { DbService } from './db.service.js';
import { ArticlesSelectParams, DbArticle } from './types.js';

@injectable()
export class ArticlesService {
  constructor(
    private authService: AuthService,
    private utils: UtilService,
    private db: DbService,
    private config: AppConfigService,
    private injector: Injector
  ) {}

  async getLastArticles(queryParams: Partial<ArticlesSelectParams> = {}) {
    const articlesSelectParams: ArticlesSelectParams = {
      tag: queryParams.tag || '',
      author: queryParams.author || '',
      favorited: queryParams.favorited || '',
      offset: queryParams.offset || 0,
      limit: queryParams.limit || this.config.perPage,
    };
    const userId = await this.authService.getCurrentUserId();
    const { dbArticles, foundRows } = await this.db.getArticles(userId, articlesSelectParams);
    const articles = new ArticlesDto();
    articles.articles = dbArticles.map((dbArticle) => this.transformToArticleItem(dbArticle));
    articles.articlesCount = foundRows;
    return articles;
  }

  async getFeed(queryParams: Partial<ArticlesSelectParams> = {}) {
    const currentUserId = await this.authService.getCurrentUserId();
    if (currentUserId) {
      const offset: number = queryParams.offset || 0;
      const limit: number = queryParams.limit || this.config.perPage;
      const { dbArticles, foundRows } = await this.db.getArticlesByFeed(currentUserId, offset, limit);
      const articles = new ArticlesDto();
      articles.articles = dbArticles.map((dbArticle) => this.transformToArticleItem(dbArticle));
      articles.articlesCount = foundRows;
      return articles;
    } else {
      return this.utils.throw401Error('jwt-token');
    }
  }

  async getArticleBySlug(slug: string) {
    const currentUserId = await this.authService.getCurrentUserId();
    const dbArticle = await this.db.getArticleBySlug(slug, currentUserId);
    if (!dbArticle) {
      this.utils.throw404Error('slug', 'The article not found.');
    }
    const article = this.transformToArticleItem(dbArticle!);
    const articleItem = new ArticleItemDto();
    articleItem.article = article;
    return articleItem;
  }

  async postArticle(userId: number, articlePostData: ArticlePostDto['article']) {
    const slug = this.getSlug(articlePostData.title);

    const slugExists = await this.db.getArticleBySlug(slug, 0);
    if (slugExists) {
      const dictService = this.injector.get(DictService) as DictService;
      const dict = dictService.getDictionary(ServerDict);
      throw new CustomError({
        msg1: dict.slugExists('slug', slug),
      });
    }

    const insertResult = await this.db.postArticle(userId, slug, articlePostData);
    const currentUserId = await this.authService.getCurrentUserId();
    const dbArticle = await this.db.getArticleById(Number(insertResult.insertId), currentUserId);
    const article = this.transformToArticleItem(dbArticle!);
    const articleItem = new ArticleItemDto();
    articleItem.article = article;
    return articleItem;
  }

  async putArticle(oldSlug: string, articlePutData: ArticlePutDto['article']) {
    const hasPermissions = await this.authService.hasPermissions([Permission.canEditAnyPost]);
    const currentUserId = await this.authService.getCurrentUserId();
    const newSlug = this.getSlug(articlePutData.title) || oldSlug;
    const updateResult = await this.db.putArticle(currentUserId, hasPermissions, oldSlug, newSlug, articlePutData);
    if (!updateResult.affectedRows) {
      this.utils.throw403Error('permissions', "`You don't have permission to change this article.");
    }

    return this.getArticleBySlug(newSlug);
  }

  async deleteArticle(slug: string) {
    const hasPermissions = await this.authService.hasPermissions([Permission.canDeleteAnyPost]);
    const currentUserId = await this.authService.getCurrentUserId();
    const resultSetHeader = await this.db.deleteArticle(currentUserId, hasPermissions, slug);
    if (!resultSetHeader.affectedRows) {
      this.utils.throw403Error('permissions', "You don't have permission to delete this article.");
    }

    return { ok: 1 };
  }

  transformToArticleItem(dbArticle: DbArticle): ArticleDto {
    dbArticle.createdAt = dbArticle.createdAt * 1000;
    dbArticle.updatedAt = dbArticle.updatedAt * 1000;

    const author = pickProperties(new AuthorDto(), dbArticle as Omit<DbArticle, 'following'>);
    author.following = Number(dbArticle.following) === 1;

    const article = pickProperties(
      new ArticleDto(),
      dbArticle as Omit<DbArticle, 'favorited' | 'createdAt' | 'updatedAt'>
    );
    article.author = author;
    article.createdAt = new Date(article.createdAt).toISOString();
    article.updatedAt = new Date(article.updatedAt).toISOString();
    article.favorited = Number(dbArticle.favorited) === 1;
    article.favoritesCount = Number(dbArticle.favoritesCount);
    return article;
  }

  getSlug(title: string = '') {
    return title.toLocaleLowerCase().replace(/ /g, '-');
  }
}
