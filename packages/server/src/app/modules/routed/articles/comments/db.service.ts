import { OkPacket } from 'mysql';
import { Injectable } from '@ts-stack/di';

import { MysqlService } from '@service/mysql/mysql.service';
import { DbComment } from './types';

@Injectable()
export class DbService {
  constructor(private mysql: MysqlService) {}

  async postComment(userId: number, slug: string, body: string) {
    const sql = `
    insert into cur_comments(userId, body, articleId)
    select ? as userId, ? as body, articleId
    from cur_articles as a
    where a.slug = ?
    ;`;
    const { rows } = await this.mysql.query(sql, [userId, body, slug]);
    return rows as OkPacket;
  }

  async deleteArticle(userId: number, hasPermissions: boolean, commentId: number) {
    let sql = `
    delete from cur_comments
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
    from cur_comments as c
    join cur_users as u
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
