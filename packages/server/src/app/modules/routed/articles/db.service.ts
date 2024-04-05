import { ResultSetHeader } from 'mysql2';
import { injectable } from '@ditsmod/core';

import { MysqlService } from '#service/mysql/mysql.service.js';
import { ArticlesSelectParams, DbArticle } from './types.js';
import { ArticlePost, ArticlePut, Tables } from './models.js';

@injectable()
export class DbService {
  constructor(private mysql: MysqlService<Tables>) {}

  async postArticle(userId: number, slug: string, { title, description, body, tagList }: ArticlePost) {
    const result = await this.mysql
      .insertFromSet('curr_articles', {
        userId,
        title,
        slug,
        description,
        body,
        tagList: JSON.stringify(tagList || []),
      })
      .$runHook<ResultSetHeader>();

    if (tagList && tagList.length) {
      await this.insertIntoDictTags(userId, tagList);
      await this.insertIntoMapArticlesTags(result.insertId, tagList);
    }
    return result;
  }

  insertIntoDictTags(userId: number, tagList: string[]) {
    const values = tagList.map((tag) => [tag, userId]);
    return this.mysql.insertFromValues('dict_tags', ['tagName', 'creatorId'], values).ignore().$runHook();
  }

  async insertIntoMapArticlesTags(articleId: number, tagList: string[]) {
    for (const tagName of tagList) {
      await this.mysql
        .insertFromSelect('map_articles_tags', ['articleId', 'tagId'], (sb) => {
          return sb
            .select(`${articleId} as articleId`, 'tagId')
            .from('dict_tags')
            .where((eb) => eb.isTrue({ tagName }));
        })
        .ignore()
        .$runHook();
    }
  }

  protected makePutArticleQuery() {
    return this.mysql
      .update('curr_articles')
      .set('title = ifnull(?, title)')
      .set('description = ifnull(?, description)')
      .set('body = ifnull(?, body)')
      .set('slug = ifnull(?, slug)')
      .where('slug = ?');
  }

  async putArticle(
    userId: number,
    hasPermissions: boolean,
    oldSlug: string,
    newSlug: string,
    { title, description, body }: ArticlePut
  ) {
    return this.mysql
      .getQuery(this.makePutArticleQuery.bind(this))
      .$if(!hasPermissions, (ub) => {
        // If no permissions, only owner can update the article.
        return ub.where({ userId });
      })
      .$runHook<ResultSetHeader>({}, title, description, body, newSlug, oldSlug);
  }

  async deleteArticle(userId: number, hasPermissions: boolean, slug: string) {
    let sql = `
    delete from curr_articles
    where slug = ?`;

    const params: (string | number | undefined)[] = [slug];

    if (!hasPermissions) {
      // If no permissions, only owner can delete the article.
      sql += ` and userId = ?;`;
      params.push(userId);
    }

    const { rows } = await this.mysql.query(sql, params);
    return rows as ResultSetHeader;
  }

  async getArticleById(articleId: number, currentUserId: number) {
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
      if(fav.userId is null, 0, 1) as favorited,
      u.username,
      u.bio,
      u.image,
      if(fol.followerId is null, 0, 1) as following
    from curr_articles as a
    join curr_users as u
      using(userId)
    left join map_followers as fol
      on a.userId = fol.userId
        and fol.followerId = ${currentUserId}
    left join map_favorites as fav
      on a.articleId = fav.articleId
        and a.userId = ${currentUserId}
    where a.articleId = ${articleId}
    ;`;
    const { rows } = await this.mysql.query(sql);
    return (rows as DbArticle[])[0];
  }

  async getArticleBySlug(slug: string, currentUserId: number) {
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
      if(fav.userId is null, 0, 1) as favorited,
      u.username,
      u.bio,
      u.image,
      if(fol.followerId is null, 0, 1) as following
    from curr_articles as a
    join curr_users as u
      using(userId)
    left join map_followers as fol
      on a.userId = fol.userId
        and fol.followerId = ${currentUserId}
    left join map_favorites as fav
      on a.articleId = fav.articleId
        and a.userId = ${currentUserId}
    where a.slug = ?
    ;`;
    const { rows } = await this.mysql.query(sql, slug);
    return (rows as DbArticle[])[0];
  }

  async getArticlesByFeed(currentUserId: number, offset: number, perPage: number) {
    const sql = `
    select
    SQL_CALC_FOUND_ROWS
      a.slug,
      a.title,
      a.description,
      a.body,
      a.tagList,
      a.createdAt,
      a.updatedAt,
      a.favoritesCount,
      if(fav.userId is null, 0, 1) as favorited,
      u.username,
      u.bio,
      u.image,
      1 as following
    from curr_articles as a
    join curr_users as u
      using(userId)
    join map_followers as fol
      on a.userId = fol.userId
    left join map_favorites as fav
      on a.articleId = fav.articleId
        and a.userId = ${currentUserId}
    where fol.followerId = ${currentUserId}
    order by a.articleId desc
    limit ${offset}, ${perPage}
    ;`;
    const { result, foundRows } = await this.mysql.queryWithFoundRows(sql);
    return { dbArticles: result.rows as DbArticle[], foundRows };
  }

  async getArticles(currentUserId: number, params: ArticlesSelectParams) {
    const select = `
    select
    SQL_CALC_FOUND_ROWS
      a.slug,
      a.title,
      a.description,
      a.body,
      a.tagList,
      a.createdAt,
      a.updatedAt,
      a.favoritesCount,
      if(fav.userId is null, 0, 1) as favorited,
      u.username,
      u.bio,
      u.image,
      if(fol.followerId is null, 0, 1) as following
    from curr_articles as a
    join curr_users as u
      using(userId)
    left join map_followers as fol
      on a.userId = fol.userId
        and fol.followerId = ${currentUserId}
    left join map_favorites as fav
      on a.articleId = fav.articleId
        and a.userId = ${currentUserId}
    `;

    let join = '';
    const aWhere: string[] = [];
    const dbParams: (string | number)[] = [];

    if (params.tag) {
      join += `
      join map_articles_tags as at
        on a.articleId = at.articleId
      join dict_tags as t
        using(tagId)`;

      aWhere.push(`t.tagName = ?`);
      dbParams.push(params.tag);
    }

    if (params.author) {
      aWhere.push(`u.username = ?`);
      dbParams.push(params.author);
    }

    if (params.favorited) {
      join += `
      join map_favorites as fav2
        on a.articleId = fav2.articleId
      join curr_users as u2
        on fav2.userId = u2.userId
      `;

      aWhere.push(`u2.username = ?`);
      dbParams.push(params.favorited);
    }

    const orderAndLimit = `
    order by a.articleId desc
    limit ${params.offset}, ${params.limit}
    ;`;

    const where = aWhere.length ? `\nwhere ${aWhere.join(' and ')}` : '';
    const sql1 = `${select}${join}${where}${orderAndLimit}`;
    const { result, foundRows } = await this.mysql.queryWithFoundRows(sql1, dbParams);
    return { dbArticles: result.rows as DbArticle[], foundRows };
  }
}
