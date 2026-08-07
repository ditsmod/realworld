import { injectable } from '@holu/core';

import { AuthService } from '#service/auth/auth.service.js';
import { ArticlesService } from '../articles.service.js';
import { DbService } from './db.service.js';

@injectable()
export class FavoriteService {
  constructor(private db: DbService, private authService: AuthService, private articlesService: ArticlesService) {}

  async favoriteArticle(slug: string) {
    const userId = await this.authService.getCurrentUserId();
    await this.db.setArticleFaforite(userId, slug);
    return this.articlesService.getArticleBySlug(slug);
  }

  async unfavoriteArticle(slug: string) {
    const userId = await this.authService.getCurrentUserId();
    await this.db.deleteArticleFaforite(userId, slug);
    return this.articlesService.getArticleBySlug(slug);
  }
}
