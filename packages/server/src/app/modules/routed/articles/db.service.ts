import { ResultSetHeader } from 'mysql2';
import { injectable } from '@ditsmod/core';
import { injectRepository } from '@ditsmod/typeorm';
import { Repository } from 'typeorm';

import {
  ArticleEntity,
  TagEntity,
  ArticleTagEntity,
  UserEntity,
  FavoriteEntity,
  FollowerEntity,
} from '#app/entities/index.js';
import { ArticlesSelectParams, DbArticle } from './types.js';
import { ArticlePost, ArticlePut } from './articles.dto.js';

@injectable()
export class DbService {
  constructor(
    @injectRepository(ArticleEntity) private articleRepo: Repository<ArticleEntity>,
    @injectRepository(TagEntity) private tagRepo: Repository<TagEntity>,
    @injectRepository(ArticleTagEntity) private articleTagRepo: Repository<ArticleTagEntity>
  ) {}

  async postArticle(userId: number, slug: string, { title, description, body, tagList }: ArticlePost) {
    const article = this.articleRepo.create({
      userId,
      title,
      slug,
      description,
      body,
      tagList: tagList || [],
      createdAt: Math.floor(Date.now() / 1000),
    });
    const saved = await this.articleRepo.save(article);
    if (tagList && tagList.length) {
      await this.insertIntoDictTags(userId, tagList);
      await this.insertIntoMapArticlesTags(saved.articleId, tagList);
    }
    return { insertId: saved.articleId } as ResultSetHeader;
  }

  async insertIntoDictTags(userId: number, tagList: string[]) {
    for (const tagName of tagList) {
      const existing = await this.tagRepo.findOneBy({ tagName });
      if (!existing) {
        await this.tagRepo.save({
          tagName,
          creatorId: userId,
          createdAt: Math.floor(Date.now() / 1000),
        });
      }
    }
  }

  async insertIntoMapArticlesTags(articleId: number, tagList: string[]) {
    for (const tagName of tagList) {
      const tag = await this.tagRepo.findOneBy({ tagName });
      if (tag) {
        const existing = await this.articleTagRepo.findOneBy({ articleId, tagId: tag.tagId });
        if (!existing) {
          await this.articleTagRepo.save({ articleId, tagId: tag.tagId });
        }
      }
    }
  }

  async putArticle(
    userId: number,
    hasPermissions: boolean,
    oldSlug: string,
    newSlug: string,
    { title, description, body }: ArticlePut
  ) {
    const updateData: Partial<ArticleEntity> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (body !== undefined) updateData.body = body;
    if (newSlug !== undefined) updateData.slug = newSlug;

    const where: any = { slug: oldSlug };
    if (!hasPermissions) {
      where.userId = userId;
    }

    const result = await this.articleRepo.update(where, updateData);
    return { affectedRows: result.affected || 0 } as ResultSetHeader;
  }

  async deleteArticle(userId: number, hasPermissions: boolean, slug: string) {
    let result;
    if (!hasPermissions) {
      result = await this.articleRepo.delete({ slug, userId });
    } else {
      result = await this.articleRepo.delete({ slug });
    }
    return { affectedRows: result.affected || 0 } as ResultSetHeader;
  }

  protected parseTagList(article: DbArticle) {
    if (article && typeof article.tagList === 'string') {
      try {
        article.tagList = JSON.parse(article.tagList);
      } catch {
        // ignore parse error
      }
    }
    return article;
  }

  private getArticleQueryBuilder(currentUserId: number) {
    return this.articleRepo
      .createQueryBuilder('a')
      .select([
        'a.slug AS slug',
        'a.title AS title',
        'a.description AS description',
        'a.body AS body',
        'a.tagList AS tagList',
        'a.createdAt AS createdAt',
        'a.updatedAt AS updatedAt',
        'a.favoritesCount AS favoritesCount',
        'IF(fav.userId IS NULL, 0, 1) AS favorited',
        'u.username AS username',
        'u.bio AS bio',
        'u.image AS image',
        'IF(fol.followerId IS NULL, 0, 1) AS following',
      ])
      .innerJoin(UserEntity, 'u', 'u.userId = a.userId')
      .leftJoin(FollowerEntity, 'fol', 'a.userId = fol.userId AND fol.followerId = :currentUserId', { currentUserId })
      .leftJoin(FavoriteEntity, 'fav', 'a.articleId = fav.articleId AND fav.userId = :currentUserId', {
        currentUserId,
      });
  }

  async getArticleById(articleId: number, currentUserId: number) {
    const raw = await this.getArticleQueryBuilder(currentUserId)
      .where('a.articleId = :articleId', { articleId })
      .getRawOne();
    return this.parseTagList(raw);
  }

  async getArticleBySlug(slug: string, currentUserId: number) {
    const raw = await this.getArticleQueryBuilder(currentUserId).where('a.slug = :slug', { slug }).getRawOne();
    return this.parseTagList(raw);
  }

  async getArticlesByFeed(currentUserId: number, offset: number, perPage: number) {
    const qb = this.articleRepo
      .createQueryBuilder('a')
      .select([
        'a.slug AS slug',
        'a.title AS title',
        'a.description AS description',
        'a.body AS body',
        'a.tagList AS tagList',
        'a.createdAt AS createdAt',
        'a.updatedAt AS updatedAt',
        'a.favoritesCount AS favoritesCount',
        'IF(fav.userId IS NULL, 0, 1) AS favorited',
        'u.username AS username',
        'u.bio AS bio',
        'u.image AS image',
        '1 AS following',
      ])
      .innerJoin(UserEntity, 'u', 'u.userId = a.userId')
      .innerJoin(FollowerEntity, 'fol', 'a.userId = fol.userId AND fol.followerId = :currentUserId', { currentUserId })
      .leftJoin(FavoriteEntity, 'fav', 'a.articleId = fav.articleId AND fav.userId = :currentUserId', { currentUserId })
      .orderBy('a.articleId', 'DESC')
      .offset(offset)
      .limit(perPage);

    const [rows, foundRows] = await Promise.all([qb.getRawMany(), qb.getCount()]);

    const dbArticles = rows.map((art) => this.parseTagList(art));
    return { dbArticles, foundRows };
  }

  async getArticles(currentUserId: number, params: ArticlesSelectParams) {
    const qb = this.articleRepo
      .createQueryBuilder('a')
      .select([
        'a.slug AS slug',
        'a.title AS title',
        'a.description AS description',
        'a.body AS body',
        'a.tagList AS tagList',
        'a.createdAt AS createdAt',
        'a.updatedAt AS updatedAt',
        'a.favoritesCount AS favoritesCount',
        'IF(fav.userId IS NULL, 0, 1) AS favorited',
        'u.username AS username',
        'u.bio AS bio',
        'u.image AS image',
        'IF(fol.followerId IS NULL, 0, 1) AS following',
      ])
      .innerJoin(UserEntity, 'u', 'u.userId = a.userId')
      .leftJoin(FollowerEntity, 'fol', 'a.userId = fol.userId AND fol.followerId = :currentUserId', { currentUserId })
      .leftJoin(FavoriteEntity, 'fav', 'a.articleId = fav.articleId AND fav.userId = :currentUserId', {
        currentUserId,
      });

    if (params.tag) {
      qb.innerJoin(ArticleTagEntity, 'at', 'a.articleId = at.articleId')
        .innerJoin(TagEntity, 't', 't.tagId = at.tagId')
        .andWhere('t.tagName = :tag', { tag: params.tag });
    }

    if (params.author) {
      qb.andWhere('u.username = :author', { author: params.author });
    }

    if (params.favorited) {
      qb.innerJoin(FavoriteEntity, 'fav2', 'a.articleId = fav2.articleId')
        .innerJoin(UserEntity, 'u2', 'fav2.userId = u2.userId')
        .andWhere('u2.username = :favorited', { favorited: params.favorited });
    }

    qb.orderBy('a.articleId', 'DESC').offset(params.offset).limit(params.limit);

    const [rows, foundRows] = await Promise.all([qb.getRawMany(), qb.getCount()]);

    const dbArticles = rows.map((art) => this.parseTagList(art));
    return { dbArticles, foundRows };
  }
}
