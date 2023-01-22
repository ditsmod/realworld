import { injectable } from '@ditsmod/core';
import { sql } from 'kysely';

import { MysqlService } from '@service/mysql/mysql.service';
import { ArticlesSelectParams, DbArticle } from './types';
import { ArticlePost, ArticlePut, Database } from './models';

@injectable()
export class DbService {
  constructor(private mysql: MysqlService) {}

  async postArticle(userId: number, slug: string, { title, description, body, tagList: rawTags }: ArticlePost) {
    const db = await this.mysql.getKysely<Database>();

    const tagList = JSON.stringify(rawTags || []);
    const result = await db
      .insertInto('curr_articles')
      .values({ userId, title, slug, description, body, tagList })
      .executeTakeFirst();

    if (tagList && tagList.length) {
      await this.insertIntoDictTags(userId, rawTags!);
      await this.insertIntoMapArticlesTags(Number(result.insertId), rawTags!);
    }
    return result;
  }

  async insertIntoDictTags(userId: number, tagList: string[]) {
    const db = await this.mysql.getKysely<Database>();

    const query = db.insertInto('dict_tags').ignore().columns(['tagName', 'creatorId']);
    const tags = tagList.map((tagName) => ({ tagName, creatorId: userId }));
    return query.values(tags).execute();
  }

  async insertIntoMapArticlesTags(articleId: number, tagList: string[]) {
    const db = await this.mysql.getKysely<Database>();

    for (const tagName of tagList) {
      await db
        .insertInto('map_articles_tags')
        .ignore()
        .columns(['articleId', 'tagId'])
        .expression((eb) =>
          eb
            .selectFrom('dict_tags as t')
            .select([sql`${articleId}`.as('articleId'), 'tagId'])
            .where('t.tagName', '=', tagName)
        )
        .executeTakeFirst();
    }
  }

  async putArticle(
    userId: number,
    hasPermissions: boolean,
    oldSlug: string,
    newSlug: string,
    { title, description, body }: ArticlePut
  ) {
    const db = await this.mysql.getKysely<Database>();

    return db
      .updateTable('curr_articles')
      .set({
        title: sql`ifnull(${title}, title)`,
        description: sql`ifnull(${description}, description)`,
        body: sql`ifnull(${body}, body)`,
        slug: sql`ifnull(${newSlug}, slug)`,
      })
      .where('slug', '=', oldSlug)
      .$if(!hasPermissions, (eb) => {
        // If no permissions, only owner can delete the article.
        return eb.where('userId', '=', userId);
      })
      .executeTakeFirst();
  }

  async deleteArticle(userId: number, hasPermissions: boolean, slug: string) {
    const db = await this.mysql.getKysely<Database>();

    return db
      .deleteFrom('curr_articles')
      .where('slug', '=', slug)
      .$if(!hasPermissions, (eb) => {
        // If no permissions, only owner can delete the article.
        return eb.where('userId', '=', userId);
      })
      .executeTakeFirst();
  }

  async getArticleById(articleId: number, currentUserId: number) {
    const db = await this.mysql.getKysely<Database>();

    return db
      .selectFrom('curr_articles as a')
      .innerJoin('curr_users as u', 'a.userId', 'u.userId')
      .leftJoin('map_followers as fol', (jb) =>
        jb.onRef('a.userId', '=', 'fol.userId').on('fol.followerId', '=', currentUserId)
      )
      .leftJoin('map_favorites as fav', (jb) =>
        jb.onRef('a.articleId', '=', 'fav.articleId').on('a.userId', '=', currentUserId)
      )
      .select([
        'a.slug',
        'a.title',
        'a.description',
        'a.body',
        'a.tagList',
        'a.createdAt',
        'a.updatedAt',
        'a.favoritesCount',
        sql`if(fav.userId is null, 0, 1)`.as('favorited'),
        'u.username',
        'u.bio',
        'u.image',
        sql`if(fol.followerId is null, 0, 1)`.as('following'),
      ])
      .where('a.articleId', '=', articleId)
      .executeTakeFirst() as unknown as DbArticle;
  }

  async getArticleBySlug(slug: string, currentUserId: number) {
    const db = await this.mysql.getKysely<Database>();

    return db
      .selectFrom('curr_articles as a')
      .innerJoin('curr_users as u', 'a.userId', 'u.userId')
      .leftJoin('map_followers as fol', (jb) =>
        jb.onRef('a.userId', '=', 'fol.userId').on('fol.followerId', '=', currentUserId)
      )
      .leftJoin('map_favorites as fav', (jb) =>
        jb.onRef('a.articleId', '=', 'fav.articleId').on('a.userId', '=', currentUserId)
      )
      .select([
        'a.slug',
        'a.title',
        'a.description',
        'a.body',
        'a.tagList',
        'a.createdAt',
        'a.updatedAt',
        'a.favoritesCount',
        sql`if(fav.userId is null, 0, 1)`.as('favorited'),
        'u.username',
        'u.bio',
        'u.image',
        sql`if(fol.followerId is null, 0, 1)`.as('following'),
      ])
      .where('a.slug', '=', slug)
      .executeTakeFirst() as unknown as DbArticle;
  }

  async getArticlesByFeed(currentUserId: number, offset: number, perPage: number) {
    const db = await this.mysql.getKysely<Database>();

    const baseQuery = db
      .selectFrom('curr_articles as a')
      .innerJoin('curr_users as u', 'a.userId', 'u.userId')
      .innerJoin('map_followers as fol', 'a.userId', 'fol.userId')
      .leftJoin('map_favorites as fav', (jb) =>
        jb.onRef('a.articleId', '=', 'fav.articleId').on('a.userId', '=', currentUserId)
      )
      .where('fol.followerId', '=', currentUserId)
      .orderBy('a.articleId', 'desc')
      .offset(offset)
      .limit(perPage);

    const result1 = await baseQuery
      .select([
        'a.slug',
        'a.title',
        'a.description',
        'a.body',
        'a.tagList',
        'a.createdAt',
        'a.updatedAt',
        'a.favoritesCount',
        sql`if(fav.userId is null, 0, 1)`.as('favorited'),
        'u.username',
        'u.bio',
        'u.image',
        sql`1`.as('following'),
      ])
      .execute();

    const result2 = await baseQuery
      .select(db.fn.count('a.articleId' as any).as('foundRows'))
      .executeTakeFirst();

    return { dbArticles: result1 as unknown as DbArticle[], foundRows: Number(result2?.foundRows) };
  }

  async getArticles(currentUserId: number, params: ArticlesSelectParams) {
    const db = await this.mysql.getKysely<Database>();

    const query1 = db
      .selectFrom('curr_articles as a')
      .innerJoin('curr_users as u', 'a.userId', 'u.userId')
      .leftJoin('map_followers as fol', (jb) =>
        jb.onRef('a.userId', '=', 'fol.userId').on('fol.followerId', '=', currentUserId)
      )
      .leftJoin('map_favorites as fav', (jb) =>
        jb.onRef('a.articleId', '=', 'fav.articleId').on('a.userId', '=', currentUserId)
      )
      .select([
        'a.slug',
        'a.title',
        'a.description',
        'a.body',
        'a.tagList',
        'a.createdAt',
        'a.updatedAt',
        'a.favoritesCount',
        sql`if(fav.userId is null, 0, 1)`.as('favorited'),
        'u.username',
        'u.bio',
        'u.image',
        sql`if(fol.followerId is null, 0, 1)`.as('following'),
      ])
      .$if(Boolean(params.tag), (eb) =>
        eb
          .innerJoin('map_articles_tags as at', 'a.articleId', 'at.articleId')
          .innerJoin('dict_tags as t', 'at.tagId', 't.tagId')
          .where('t.tagName', '=', params.tag)
      )
      .$if(Boolean(params.author), (eb) => eb.where('u.username', '=', params.author))
      .$if(Boolean(params.favorited), (eb) =>
        eb
          .innerJoin('map_favorites as fav2', 'a.articleId', 'fav2.articleId')
          .innerJoin('curr_users as u2', 'fav2.userId', 'u2.userId')
          .where('u2.username', '=', params.favorited)
      )
      .withPlugin({
        transformQuery(args) {
          return args.node;
        },
        async transformResult(args) {
          return args.result;
        },
      })
      .orderBy('a.articleId', 'desc')
      .offset(params.offset)
      .limit(params.limit);

    const query2 = query1
      .clearSelect()
      .clearLimit()
      .clearOffset()
      .select(sql`count(*)`.as('foundRows'));
    const result1 = (await query1.execute()) as unknown as DbArticle[];
    const result2 = (await query2.executeTakeFirst());
    return { dbArticles: result1, foundRows: Number(result2?.foundRows) };
  }
}
