import type { Injector } from '@holu/core';
import { CustomError } from '@holu/core/errors';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import type { AuthService } from '#service/auth/auth.service.js';
import type { UtilService } from '#service/util/util.service.js';
import type { AppConfigService } from '#service/app-config/config.service.js';
import { ArticlesService } from './articles.service.js';
import type { DbService } from './db.service.js';
import { ArticleItemDto, ArticlesDto } from './articles.dto.js';
import type { DbArticle } from './types.js';

describe('ArticlesService', () => {
  let articlesService: ArticlesService;
  let authServiceMock: any;
  let utilMock: any;
  let dbMock: any;
  let configMock: any;
  let injectorMock: any;
  let dictServiceMock: any;

  const mockDbArticle: DbArticle = {
    slug: 'hello-world',
    title: 'Hello World',
    description: 'Desc',
    body: 'Body text',
    tagList: ['tag1'],
    createdAt: 1600000000,
    updatedAt: 1600000000,
    favorited: 1,
    favoritesCount: 5,
    username: 'author',
    bio: 'bio',
    image: 'img.jpg',
    following: 1,
  };

  beforeEach(() => {
    authServiceMock = {
      getCurrentUserId: vi.fn().mockResolvedValue(1),
      hasPermissions: vi.fn().mockResolvedValue(true),
    };

    utilMock = {
      throw401Error: vi.fn().mockImplementation(() => {
        throw new Error('401 Unauthorized');
      }),
      throw403Error: vi.fn().mockImplementation((param, msg) => {
        throw new Error(`403: ${msg}`);
      }),
      throw404Error: vi.fn().mockImplementation((param, msg) => {
        throw new Error(`404: ${msg}`);
      }),
    };

    dbMock = {
      getArticles: vi.fn(),
      getArticlesByFeed: vi.fn(),
      getArticleBySlug: vi.fn(),
      getArticleById: vi.fn(),
      postArticle: vi.fn(),
      putArticle: vi.fn(),
      deleteArticle: vi.fn(),
    };

    configMock = {
      perPage: 10,
    };

    dictServiceMock = {
      getDictionary: vi.fn().mockReturnValue({
        slugExists: (param: string, slug: string) => `Slug ${slug} exists`,
      }),
    };

    injectorMock = {
      get: vi.fn().mockReturnValue(dictServiceMock),
    };

    articlesService = new ArticlesService(
      authServiceMock as unknown as AuthService,
      utilMock as unknown as UtilService,
      dbMock as unknown as DbService,
      configMock as unknown as AppConfigService,
      injectorMock as unknown as Injector
    );
  });

  describe('getSlug', () => {
    it('should convert title to lowercase kebab-case slug', () => {
      expect(articlesService.getSlug('Hello World Example')).toBe('hello-world-example');
    });
  });

  describe('transformToArticleItem', () => {
    it('should correctly format article dates and booleans', () => {
      const result = articlesService.transformToArticleItem({ ...mockDbArticle });

      expect(result.slug).toBe('hello-world');
      expect(result.favorited).toBe(true);
      expect(result.author.following).toBe(true);
      expect(result.createdAt).toBe(new Date(1600000000 * 1000).toISOString());
    });
  });

  describe('getLastArticles', () => {
    it('should return ArticlesDto object with mapped article items', async () => {
      dbMock.getArticles.mockResolvedValue({
        dbArticles: [{ ...mockDbArticle }],
        foundRows: 1,
      });

      const result = await articlesService.getLastArticles({ tag: 'node' });

      expect(dbMock.getArticles).toHaveBeenCalledWith(1, {
        tag: 'node',
        author: '',
        favorited: '',
        offset: 0,
        limit: 10,
      });
      expect(result).toBeInstanceOf(ArticlesDto);
      expect(result.articlesCount).toBe(1);
      expect(result.articles[0].slug).toBe('hello-world');
    });
  });

  describe('getFeed', () => {
    it('should return articles feed when user is authenticated', async () => {
      dbMock.getArticlesByFeed.mockResolvedValue({
        dbArticles: [{ ...mockDbArticle }],
        foundRows: 1,
      });

      const result = (await articlesService.getFeed({ offset: 0, limit: 5 })) as ArticlesDto;

      expect(dbMock.getArticlesByFeed).toHaveBeenCalledWith(1, 0, 5);
      expect(result.articlesCount).toBe(1);
    });

    it('should throw 401 error when user is not authenticated', async () => {
      authServiceMock.getCurrentUserId.mockResolvedValue(0);

      await expect(articlesService.getFeed()).rejects.toThrow('401 Unauthorized');
    });
  });

  describe('getArticleBySlug', () => {
    it('should return ArticleItemDto when article is found', async () => {
      dbMock.getArticleBySlug.mockResolvedValue({ ...mockDbArticle });

      const result = await articlesService.getArticleBySlug('hello-world');

      expect(dbMock.getArticleBySlug).toHaveBeenCalledWith('hello-world', 1);
      expect(result).toBeInstanceOf(ArticleItemDto);
      expect(result.article.title).toBe('Hello World');
    });

    it('should throw 404 error when article is not found', async () => {
      dbMock.getArticleBySlug.mockResolvedValue(null);

      await expect(articlesService.getArticleBySlug('missing')).rejects.toThrow('404: The article not found.');
    });
  });

  describe('postArticle', () => {
    it('should throw CustomError if slug already exists', async () => {
      dbMock.getArticleBySlug.mockResolvedValue({ ...mockDbArticle });

      await expect(
        articlesService.postArticle(1, {
          title: 'Hello World',
          description: 'Desc',
          body: 'Body',
          tagList: [],
        })
      ).rejects.toThrow(CustomError);
    });

    it('should insert article and return created ArticleItemDto when slug is unique', async () => {
      dbMock.getArticleBySlug.mockResolvedValueOnce(null).mockResolvedValueOnce({ ...mockDbArticle });
      dbMock.postArticle.mockResolvedValue({ insertId: 1 });
      dbMock.getArticleById.mockResolvedValue({ ...mockDbArticle });

      const articleData = {
        title: 'New Article Title',
        description: 'Desc',
        body: 'Body',
        tagList: [],
      };

      const result = await articlesService.postArticle(1, articleData);

      expect(dbMock.postArticle).toHaveBeenCalledWith(1, 'new-article-title', articleData);
      expect(result).toBeInstanceOf(ArticleItemDto);
    });
  });

  describe('putArticle', () => {
    it('should update article and return updated article by slug', async () => {
      dbMock.putArticle.mockResolvedValue({ affectedRows: 1 });
      dbMock.getArticleBySlug.mockResolvedValue({ ...mockDbArticle, title: 'Updated Title' });

      const result = await articlesService.putArticle('hello-world', {
        title: 'Updated Title',
      } as any);

      expect(dbMock.putArticle).toHaveBeenCalled();
      expect(result.article.title).toBe('Updated Title');
    });

    it('should throw 403 error when affectedRows is 0', async () => {
      dbMock.putArticle.mockResolvedValue({ affectedRows: 0 });

      await expect(articlesService.putArticle('hello-world', { title: 'No Permission' } as any)).rejects.toThrow(
        /403:/
      );
    });
  });

  describe('deleteArticle', () => {
    it('should delete article and return { ok: 1 } on success', async () => {
      dbMock.deleteArticle.mockResolvedValue({ affectedRows: 1 });

      const result = await articlesService.deleteArticle('hello-world');

      expect(dbMock.deleteArticle).toHaveBeenCalled();
      expect(result).toEqual({ ok: 1 });
    });

    it('should throw 403 error when affectedRows is 0', async () => {
      dbMock.deleteArticle.mockResolvedValue({ affectedRows: 0 });

      await expect(articlesService.deleteArticle('hello-world')).rejects.toThrow(/403:/);
    });
  });
});
