import type { ResultSetHeader } from 'mysql2';
import { injectable } from '@ditsmod/core';
import { injectRepository } from '@ditsmod/typeorm';
import { Repository } from 'typeorm';

import { CommentEntity, ArticleEntity, UserEntity, FollowerEntity } from '#entities';
import { DbComment } from './types.js';

@injectable()
export class DbService {
  constructor(
    @injectRepository(CommentEntity) private commentRepo: Repository<CommentEntity>,
    @injectRepository(ArticleEntity) private articleRepo: Repository<ArticleEntity>
  ) {}

  async postComment(userId: number, slug: string, body: string) {
    const article = await this.articleRepo.findOneBy({ slug });
    if (!article) {
      throw new Error('Article not found');
    }
    const comment = this.commentRepo.create({
      userId,
      articleId: article.articleId,
      body,
      createdAt: Math.floor(Date.now() / 1000),
    });
    const saved = await this.commentRepo.save(comment);
    return { insertId: saved.commentId } as ResultSetHeader;
  }

  async deleteArticle(userId: number, hasPermissions: boolean, commentId: number) {
    let result;
    if (!hasPermissions) {
      result = await this.commentRepo.delete({ commentId, userId });
    } else {
      result = await this.commentRepo.delete({ commentId });
    }
    return { affectedRows: result.affected || 0 } as unknown as ResultSetHeader;
  }

  async getComments(currentUserId: number): Promise<DbComment[]>;
  async getComments(currentUserId: number, commentId: number): Promise<DbComment>;
  async getComments(currentUserId: number, commentId?: number) {
    const qb = this.commentRepo
      .createQueryBuilder('c')
      .select([
        'c.commentId AS commentId',
        'c.createdAt AS createdAt',
        'c.updatedAt AS updatedAt',
        'c.body AS body',
        'u.username AS username',
        'u.bio AS bio',
        'u.image AS image',
        'IF(f.userId IS NULL, 0, 1) AS following',
      ])
      .innerJoin(UserEntity, 'u', 'u.userId = c.userId')
      .leftJoin(FollowerEntity, 'f', 'c.userId = f.userId AND f.followerId = :currentUserId', { currentUserId });

    if (commentId) {
      qb.where('c.commentId = :commentId', { commentId });
      return qb.getRawOne();
    } else {
      return qb.getRawMany();
    }
  }
}
