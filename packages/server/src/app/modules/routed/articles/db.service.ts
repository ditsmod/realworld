import { injectable } from '@ditsmod/core';
import { injectRepository } from '@ditsmod/typeorm';
import { Repository } from 'typeorm';

import { ArticleEntity, TagEntity, ArticleTagEntity, UserEntity, FavoriteEntity, FollowerEntity } from '#entities';
import { ArticlesSelectParams, DbArticle } from './types.js';
import { ArticlePostDto, ArticlePutDto } from './articles.dto.js';

@injectable()
export class DbService {
  constructor(
    @injectRepository(ArticleEntity) private articleRepo: Repository<ArticleEntity>,
    @injectRepository(TagEntity) private tagRepo: Repository<TagEntity>,
    @injectRepository(ArticleTagEntity) private articleTagRepo: Repository<ArticleTagEntity>,
    @injectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @injectRepository(FavoriteEntity) private favoriteRepo: Repository<FavoriteEntity>,
    @injectRepository(FollowerEntity) private followerRepo: Repository<FollowerEntity>
  ) {}

  async getArticles(currentUserId: number, params: ArticlesSelectParams) {
    const qb = this.articleRepo
      .createQueryBuilder('a')
      .select([
        'a.articleId AS articleId',
        'a.slug AS slug',
        'a.title AS title',
        'a.description AS description',
        'a.body AS body',
        'a.createdAt AS createdAt',
        'a.updatedAt AS updatedAt',
        'u.username AS username',
        'u.bio AS bio',
        'u.image AS image',
        'IF(f.userId IS NULL, 0, 1) AS favorited',
        'IF(fl.userId IS NULL, 0, 1) AS following',
      ])
      .addSelect((subQuery) => {
        return subQuery.select('COUNT(*)', 'count').from(FavoriteEntity, 'fav').where('fav.articleId = a.articleId');
      }, 'favoritesCount')
      .innerJoin(UserEntity, 'u', 'a.userId = u.userId')
      .leftJoin(FavoriteEntity, 'f', 'a.articleId = f.articleId AND f.userId = :currentUserId', { currentUserId })
      .leftJoin(FollowerEntity, 'fl', 'u.userId = fl.userId AND fl.followerId = :currentUserId', { currentUserId });

    if (params.tag) {
      qb.innerJoin(ArticleTagEntity, 'at', 'a.articleId = at.articleId').innerJoin(
        TagEntity,
        't',
        'at.tagId = t.tagId AND t.tagName = :tag',
        { tag: params.tag }
      );
    }
    if (params.author) {
      qb.andWhere('u.username = :author', { author: params.author });
    }
    if (params.favorited) {
      qb.innerJoin(FavoriteEntity, 'favFilter', 'a.articleId = favFilter.articleId').innerJoin(
        UserEntity,
        'favUser',
        'favFilter.userId = favUser.userId AND favUser.username = :favorited',
        { favorited: params.favorited }
      );
    }

    const foundRows = await qb.getCount();
    const rawArticles = await qb
      .orderBy('a.createdAt', 'DESC')
      .offset(Number(params.offset))
      .limit(Number(params.limit))
      .getRawMany();

    const dbArticles = await this.attachTagsToArticles(rawArticles);
    return { dbArticles, foundRows };
  }

  async getArticlesByFeed(currentUserId: number, offset: number, limit: number) {
    const qb = this.articleRepo
      .createQueryBuilder('a')
      .select([
        'a.articleId AS articleId',
        'a.slug AS slug',
        'a.title AS title',
        'a.description AS description',
        'a.body AS body',
        'a.createdAt AS createdAt',
        'a.updatedAt AS updatedAt',
        'u.username AS username',
        'u.bio AS bio',
        'u.image AS image',
        'IF(f.userId IS NULL, 0, 1) AS favorited',
        '1 AS following',
      ])
      .addSelect((subQuery) => {
        return subQuery.select('COUNT(*)', 'count').from(FavoriteEntity, 'fav').where('fav.articleId = a.articleId');
      }, 'favoritesCount')
      .innerJoin(UserEntity, 'u', 'a.userId = u.userId')
      .innerJoin(FollowerEntity, 'fl', 'u.userId = fl.userId AND fl.followerId = :currentUserId', { currentUserId })
      .leftJoin(FavoriteEntity, 'f', 'a.articleId = f.articleId AND f.userId = :currentUserId', { currentUserId });

    const foundRows = await qb.getCount();
    const rawArticles = await qb
      .orderBy('a.createdAt', 'DESC')
      .offset(Number(offset))
      .limit(Number(limit))
      .getRawMany();

    const dbArticles = await this.attachTagsToArticles(rawArticles);
    return { dbArticles, foundRows };
  }

  async getArticleBySlug(slug: string, currentUserId: number): Promise<DbArticle | undefined> {
    const qb = this.articleRepo
      .createQueryBuilder('a')
      .select([
        'a.articleId AS articleId',
        'a.slug AS slug',
        'a.title AS title',
        'a.description AS description',
        'a.body AS body',
        'a.createdAt AS createdAt',
        'a.updatedAt AS updatedAt',
        'u.username AS username',
        'u.bio AS bio',
        'u.image AS image',
        'IF(f.userId IS NULL, 0, 1) AS favorited',
        'IF(fl.userId IS NULL, 0, 1) AS following',
      ])
      .addSelect((subQuery) => {
        return subQuery.select('COUNT(*)', 'count').from(FavoriteEntity, 'fav').where('fav.articleId = a.articleId');
      }, 'favoritesCount')
      .innerJoin(UserEntity, 'u', 'a.userId = u.userId')
      .leftJoin(FavoriteEntity, 'f', 'a.articleId = f.articleId AND f.userId = :currentUserId', { currentUserId })
      .leftJoin(FollowerEntity, 'fl', 'u.userId = fl.userId AND fl.followerId = :currentUserId', { currentUserId })
      .where('a.slug = :slug', { slug });

    const raw = await qb.getRawOne();
    if (!raw) return undefined;
    const [article] = await this.attachTagsToArticles([raw]);
    return article;
  }

  async getArticleById(articleId: number, currentUserId: number): Promise<DbArticle | undefined> {
    const qb = this.articleRepo
      .createQueryBuilder('a')
      .select([
        'a.articleId AS articleId',
        'a.slug AS slug',
        'a.title AS title',
        'a.description AS description',
        'a.body AS body',
        'a.createdAt AS createdAt',
        'a.updatedAt AS updatedAt',
        'u.username AS username',
        'u.bio AS bio',
        'u.image AS image',
        'IF(f.userId IS NULL, 0, 1) AS favorited',
        'IF(fl.userId IS NULL, 0, 1) AS following',
      ])
      .addSelect((subQuery) => {
        return subQuery.select('COUNT(*)', 'count').from(FavoriteEntity, 'fav').where('fav.articleId = a.articleId');
      }, 'favoritesCount')
      .innerJoin(UserEntity, 'u', 'a.userId = u.userId')
      .leftJoin(FavoriteEntity, 'f', 'a.articleId = f.articleId AND f.userId = :currentUserId', { currentUserId })
      .leftJoin(FollowerEntity, 'fl', 'u.userId = fl.userId AND fl.followerId = :currentUserId', { currentUserId })
      .where('a.articleId = :articleId', { articleId });

    const raw = await qb.getRawOne();
    if (!raw) return undefined;
    const [article] = await this.attachTagsToArticles([raw]);
    return article;
  }

  async postArticle(userId: number, slug: string, articlePost: ArticlePostDto) {
    const now = Math.floor(Date.now() / 1000);
    const newArticle = await this.articleRepo.save({
      userId,
      slug,
      title: articlePost.title,
      description: articlePost.description,
      body: articlePost.body,
      createdAt: now,
      updatedAt: now,
    });

    if (articlePost.tagList?.length) {
      await this.saveTags(newArticle.articleId, userId, articlePost.tagList);
    }
    return { insertId: newArticle.articleId };
  }

  async putArticle(
    userId: number,
    hasPermissions: boolean,
    oldSlug: string,
    newSlug: string,
    articlePut: ArticlePutDto
  ) {
    const article = await this.articleRepo.findOneBy({ slug: oldSlug });
    if (!article) return { affectedRows: 0 };
    if (!hasPermissions && article.userId !== userId) return { affectedRows: 0 };

    const updateData: Partial<ArticleEntity> = {
      updatedAt: Math.floor(Date.now() / 1000),
    };
    if (articlePut.title !== undefined) {
      updateData.title = articlePut.title;
      updateData.slug = newSlug;
    }
    if (articlePut.description !== undefined) updateData.description = articlePut.description;
    if (articlePut.body !== undefined) updateData.body = articlePut.body;

    await this.articleRepo.update(article.articleId, updateData);
    return { affectedRows: 1 };
  }

  async deleteArticle(userId: number, hasPermissions: boolean, slug: string) {
    const article = await this.articleRepo.findOneBy({ slug });
    if (!article) return { affectedRows: 0 };
    if (!hasPermissions && article.userId !== userId) return { affectedRows: 0 };

    await this.articleRepo.delete(article.articleId);
    return { affectedRows: 1 };
  }

  private async saveTags(articleId: number, userId: number, tagList: string[]) {
    const now = Math.floor(Date.now() / 1000);
    for (const tagName of tagList) {
      let tag = await this.tagRepo.findOneBy({ tagName });
      if (!tag) {
        tag = await this.tagRepo.save({ tagName, createdAt: now, creatorId: userId });
      }
      await this.articleTagRepo.save({ articleId, tagId: tag.tagId });
    }
  }

  private async attachTagsToArticles(rawArticles: any[]): Promise<DbArticle[]> {
    if (!rawArticles.length) return [];
    const articleIds = rawArticles.map((a) => a.articleId);

    const tagsRaw = await this.tagRepo
      .createQueryBuilder('t')
      .select(['at.articleId AS articleId', 't.tagName AS tagName'])
      .innerJoin(ArticleTagEntity, 'at', 't.tagId = at.tagId')
      .where('at.articleId IN (:...articleIds)', { articleIds })
      .orderBy('t.tagName', 'DESC')
      .getRawMany();

    const tagsMap = new Map<number, string[]>();
    for (const t of tagsRaw) {
      const list = tagsMap.get(t.articleId) || [];
      list.push(t.tagName);
      tagsMap.set(t.articleId, list);
    }

    return rawArticles.map((a) => ({
      ...a,
      tagList: tagsMap.get(a.articleId) || [],
    }));
  }
}
