import { OkPacket } from 'mysql';
import { Injectable } from '@ts-stack/di';

import { MysqlService } from '@service/mysql/mysql.service';
import { ArticlesSelectParams, DbArticle } from './types';
import { ArticlePost } from './models';

@Injectable()
export class DbService {
  constructor(private mysql: MysqlService) {}

  async postArticles(userId: number, slug: string, { title, description, body, tagList }: ArticlePost) {
    const sql = `
    insert into cur_articles
    set
      user_id = ?,
      title = ?,
      slug = ?,
      description = ?,
      body = ?,
      tagList = ?
    ;`;
    const tags = JSON.stringify(tagList || []);
    const { rows } = await this.mysql.query(sql, [userId, title, slug, description, body, tags]);
    return (rows as OkPacket);
  }

  async getArticlesById(articleId: number, currentUserId: number) {
    const sql = `
    select
      a.slug,
      a.title,
      a.description,
      a.body,
      a.tagList,
      a.createdAt,
      a.updatedAt,
      a.favoritesCount,
      -- favorited,
      u.username,
      u.bio,
      u.image,
      if(f.follower_id is null, 0, 1) as following
    from cur_articles as a
    join cur_users as u
      using(user_id)
    left join map_followers as f
      on a.user_id = f.user_id
        and f.follower_id = ?
    where article_id = ?
    ;`;
    const { rows } = await this.mysql.query(sql, [currentUserId, articleId]);
    return (rows as DbArticle[])[0];
  }

  async getArticles(params: ArticlesSelectParams) {
    const select = `
    select
      slug,
      title,
      description,
      body,
      tagList,
      createdAt,
      updatedAt,
      favorited,
      favoritesCount
    from cur_articles
    ;`;

    let where = '';

    if (params.tag) {
      where = `
      order by article_id desc
      limit offset, row_count
      ;`;
    }

    const limit = `
    order by article_id desc
    limit offset, row_count
    ;`;
    const { rows } = await this.mysql.query(`${select}${where}${limit}`, [params.tag]);
  }
}
