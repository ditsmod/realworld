import { injectable } from '@ditsmod/core';
import { sql } from 'kysely';

import { MysqlService } from '@service/mysql/mysql.service';
import { Database } from '../models';

@injectable()
export class DbService {
  constructor(private mysql: MysqlService) {}

  async setArticleFaforite(userId: number, slug: string) {
    const db = await this.mysql.getKysely<Database>();

    await db
      .insertInto('map_favorites')
      .columns(['articleId', 'userId'])
      .expression((eb) =>
        eb
          .selectFrom('curr_articles')
          .select(['articleId', sql`${userId}`.as('userId')])
          .where('slug', '=', slug)
      )
      .executeTakeFirst();

    await db
      .updateTable('curr_articles')
      .set({ favoritesCount: sql`favoritesCount + 1` })
      .where('slug', '=', slug)
      .executeTakeFirst();
  }

  async deleteArticleFaforite(userId: number, slug: string) {
    const db = await this.mysql.getKysely<Database>();

    await db
      .deleteFrom('f' as any)
      .using('map_favorites as f')
      .innerJoin('curr_articles as a', (jb) => jb.onRef('f.articleId', '=', 'a.articleId').on('f.userId', '=', userId))
      .where('a.slug', '=', slug)
      .executeTakeFirst();

    await db
      .updateTable('curr_articles')
      .set({ favoritesCount: sql`favoritesCount - 1` })
      .where('slug', '=', slug)
      .executeTakeFirst();
  }
}
