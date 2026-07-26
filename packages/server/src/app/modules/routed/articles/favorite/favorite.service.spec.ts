import { describe, it, expect, beforeEach, vi } from 'vitest';

import type { AuthService } from '#service/auth/auth.service.js';
import type { ArticlesService } from '../articles.service.js';
import type { DbService } from './db.service.js';
import { FavoriteService } from './favorite.service.js';

describe('FavoriteService', () => {
  let favoriteService: FavoriteService;
  let dbMock: any;
  let authServiceMock: any;
  let articlesServiceMock: any;

  beforeEach(() => {
    dbMock = {
      setArticleFaforite: vi.fn(),
      deleteArticleFaforite: vi.fn(),
    };

    authServiceMock = {
      getCurrentUserId: vi.fn().mockResolvedValue(1),
    };

    articlesServiceMock = {
      getArticleBySlug: vi.fn().mockResolvedValue({
        article: { slug: 'hello-world', favorited: true },
      }),
    };

    favoriteService = new FavoriteService(
      dbMock as unknown as DbService,
      authServiceMock as unknown as AuthService,
      articlesServiceMock as unknown as ArticlesService
    );
  });

  describe('favoriteArticle', () => {
    it('should set article as favorite in DB and return article from ArticlesService', async () => {
      const result = await favoriteService.favoriteArticle('hello-world');

      expect(authServiceMock.getCurrentUserId).toHaveBeenCalled();
      expect(dbMock.setArticleFaforite).toHaveBeenCalledWith(1, 'hello-world');
      expect(articlesServiceMock.getArticleBySlug).toHaveBeenCalledWith('hello-world');
      expect(result.article.slug).toBe('hello-world');
    });
  });

  describe('unfavoriteArticle', () => {
    it('should remove article from favorites in DB and return article from ArticlesService', async () => {
      articlesServiceMock.getArticleBySlug.mockResolvedValue({
        article: { slug: 'hello-world', favorited: false },
      });

      const result = await favoriteService.unfavoriteArticle('hello-world');

      expect(authServiceMock.getCurrentUserId).toHaveBeenCalled();
      expect(dbMock.deleteArticleFaforite).toHaveBeenCalledWith(1, 'hello-world');
      expect(articlesServiceMock.getArticleBySlug).toHaveBeenCalledWith('hello-world');
      expect(result.article.favorited).toBe(false);
    });
  });
});
