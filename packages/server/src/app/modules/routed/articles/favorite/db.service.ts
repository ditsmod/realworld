import { injectable } from '@ditsmod/core';

import { MysqlService } from '#service/mysql/mysql.service.js';
import { Tables } from '../models.js';

@injectable()
export class DbService {
  constructor(private mysql: MysqlService<Tables>) {}

  async setArticleFaforite(userId: number, slug: string) {
    await this.mysql
      .insertFromSelect('map_favorites', ['articleId', 'userId'], (sb) => {
        return sb
          .select('articleId', `${userId} as userId`)
          .from('curr_articles')
          .where((eb) => eb.isTrue({ slug }));
      })
      .ignore()
      .$runHook();

    await this.mysql
      .update('curr_articles')
      .set('favoritesCount = favoritesCount + 1')
      .where({ slug })
      .$runHook();
  }

  async deleteArticleFaforite(userId: number, slug: string) {
    await this.mysql
      .delete('f')
      .from('map_favorites as f')
      .join('curr_articles as a', (jb) => jb.on('f.articleId = a.articleId').and(`f.userId = ${userId}`))
      .where((eb) => eb.isTrue({ slug }))
      .$runHook();

    await this.mysql
      .update('curr_articles')
      .set('favoritesCount = favoritesCount - 1')
      .where({ slug })
      .$runHook();
  }
}
