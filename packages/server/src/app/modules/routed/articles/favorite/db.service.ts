import { OkPacket } from 'mysql';
import { Injectable } from '@ts-stack/di';

import { MysqlService } from '@service/mysql/mysql.service';

@Injectable()
export class DbService {
  constructor(private mysql: MysqlService) {}

  async setArticleFaforite(userId: number, slug: string) {
    const sql = `insert ignore into map_favorites(articleId, userId)
    select articleId, ${userId} as userId
    from cur_articles
    where slug = ?`;
    const { rows } = await this.mysql.query(sql, slug);
    return (rows as OkPacket);
  }

  async deleteArticleFaforite(userId: number, slug: string) {
    const sql = `delete f
    from map_favorites as f
    join cur_articles as a
      on f.articleId = a.articleId
        and f.userId = ${userId}
    where a.slug = ?`;
    const { rows } = await this.mysql.query(sql, slug);
    return (rows as OkPacket);
  }
}
