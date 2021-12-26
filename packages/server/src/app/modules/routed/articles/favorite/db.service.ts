import { OkPacket } from 'mysql';
import { Injectable } from '@ts-stack/di';

import { MysqlService } from '@service/mysql/mysql.service';

@Injectable()
export class DbService {
  constructor(private mysql: MysqlService) {}

  async setArticleFaforite(userId: number, slug: string) {
    const sql1 = `insert ignore into map_favorites(articleId, userId)
    select articleId, ${userId} as userId
    from curr_articles
    where slug = ?`;
    await this.mysql.query(sql1, slug);
    
    const sql2 = `update curr_articles
    set favoritesCount = favoritesCount + 1
    where slug = ?`;
    await this.mysql.query(sql2, slug);
  }

  async deleteArticleFaforite(userId: number, slug: string) {
    const sql1 = `delete f
    from map_favorites as f
    join curr_articles as a
      on f.articleId = a.articleId
        and f.userId = ${userId}
    where a.slug = ?`;
    await this.mysql.query(sql1, slug);
    
    const sql2 = `update curr_articles
    set favoritesCount = favoritesCount - 1
    where slug = ?`;
    await this.mysql.query(sql2, slug);
  }
}
