import { injectable } from '@ditsmod/core';
import { sql } from 'kysely';

import { MysqlService } from '@service/mysql/mysql.service';
import { DbComment } from './types';
import { Database } from './models';

@injectable()
export class DbService {
  constructor(private mysql: MysqlService) {}

  async postComment(userId: number, slug: string, body: string) {
    const db = await this.mysql.getKysely<Database>();
    return db
      .insertInto('curr_comments')
      .columns(['userId', 'body', 'articleId'])
      .expression((eb) =>
        eb
          .selectFrom('curr_articles as a')
          .select([sql<number>`${userId}`.as('userId'), sql<string>`${body}`.as('body'), 'articleId'])
          .where('a.slug', '=', slug)
      )
      .executeTakeFirst();
  }

  async deleteArticle(userId: number, hasPermissions: boolean, commentId: number) {
    const db = await this.mysql.getKysely<Database>();
    const query = db
      .deleteFrom('curr_comments')
      .where('commentId', '=', commentId)
      .$if(!hasPermissions, (eb) => {
        // If no permissions, only owner can delete the comment.
        return eb.where('userId', '=', userId);
      });

    return query.executeTakeFirst();
  }

  async getComments(currentUserId: number): Promise<DbComment[]>;
  async getComments(currentUserId: number, commentId: number): Promise<DbComment>;
  async getComments(currentUserId: number, commentId?: number) {
    const db = await this.mysql.getKysely<Database>();

    const query = db
      .selectFrom('curr_comments as c')
      .innerJoin('curr_users as u', 'c.userId', 'u.userId')
      .leftJoin('map_followers as f', (jb) =>
        jb.onRef('c.userId', '=', 'f.userId').on('f.followerId', '=', currentUserId)
      )
      .select([
        'c.commentId',
        'c.createdAt',
        'c.updatedAt',
        'c.body',
        'u.username',
        'u.bio',
        'u.image',
        sql`if(f.userId is null, 0, 1)`.as('following'),
      ])
      .$if(!!commentId, (eb) => eb.where('commentId', '=', commentId!));

    const rows = await query.execute();

    if (commentId) {
      return rows[0];
    } else {
      return rows;
    }
  }
}
