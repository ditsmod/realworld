import { OkPacket } from 'mysql';
import { injectable } from '@ditsmod/core';

import { MysqlService } from '#service/mysql/mysql.service.js';
import { DbComment } from './types.js';

@injectable()
export class DbService {
  constructor(private mysql: MysqlService) {}

  async postComment(userId: number, slug: string, body: string) {
    const sql = `
    insert into curr_comments(userId, body, articleId)
    select ? as userId, ? as body, articleId
    from curr_articles as a
    where a.slug = ?
    ;`;
    const { rows } = await this.mysql.query(sql, [userId, body, slug]);
    return rows as OkPacket;
  }

  async deleteArticle(userId: number, hasPermissions: boolean, commentId: number) {
    let sql = `
    delete from curr_comments
    where commentId = ?`;

    const params: (string | number | undefined)[] = [commentId];

    if (!hasPermissions) {
      // If no permissions, only owner can delete the comment.
      sql += ` and userId = ?;`;
      params.push(userId);
    }

    const { rows } = await this.mysql.query(sql, params);
    return rows as OkPacket;
  }

  async getComments(currentUserId: number): Promise<DbComment[]>;
  async getComments(currentUserId: number, commentId: number): Promise<DbComment>;
  async getComments(currentUserId: number, commentId?: number) {
    const select = `
    select
      c.commentId,
      c.createdAt,
      c.updatedAt,
      c.body,
      u.username,
      u.bio,
      u.image,
      if(f.userId is null, 0, 1) as following
    from curr_comments as c
    join curr_users as u
      using(userId)
    left join map_followers as f
      on c.userId = f.userId
        and f.followerId = ?
    `;
    const params = [currentUserId];
    let where = '';
    if (commentId) {
      where = `where commentId = ?`;
      params.push(commentId);
    }
    const sql = select + where;
    const { rows } = await this.mysql.query(sql, params);

    if (commentId) {
      return (rows as DbComment[])[0];
    } else {
      return rows as DbComment[];
    }
  }
}
