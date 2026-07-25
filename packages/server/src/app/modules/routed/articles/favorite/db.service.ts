import { injectable } from '@ditsmod/core';
import { injectRepository, injectDataSource } from '@ditsmod/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Favorite, Article } from '#app/entities/index.js';

@injectable()
export class DbService {
  constructor(
    @injectRepository(Favorite) private favoriteRepo: Repository<Favorite>,
    @injectRepository(Article) private articleRepo: Repository<Article>,
    @injectDataSource() private dataSource: DataSource
  ) {}

  async setArticleFaforite(userId: number, slug: string) {
    const article = await this.articleRepo.findOneBy({ slug });
    if (!article) return;

    const existing = await this.favoriteRepo.findOneBy({
      articleId: article.articleId,
      userId,
    });
    if (!existing) {
      await this.favoriteRepo.save({ articleId: article.articleId, userId });
      await this.articleRepo.increment({ articleId: article.articleId }, 'favoritesCount', 1);
    }
  }

  async deleteArticleFaforite(userId: number, slug: string) {
    const article = await this.articleRepo.findOneBy({ slug });
    if (!article) return;

    const deleteResult = await this.favoriteRepo.delete({ articleId: article.articleId, userId });
    if (deleteResult.affected) {
      await this.articleRepo.decrement({ articleId: article.articleId }, 'favoritesCount', 1);
    }
  }
}
