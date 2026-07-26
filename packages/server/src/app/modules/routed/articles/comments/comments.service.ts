import { pickProperties, injectable } from '@ditsmod/core';

import { Permission } from '#shared';
import { AuthService } from '#service/auth/auth.service.js';
import { UtilService } from '#service/util/util.service.js';
import { CommentData, CommentsData, Comment } from './models.js';
import { DbService } from './db.service.js';
import { DbComment } from './types.js';
import { Author } from '../models.js';

@injectable()
export class CommentsService {
  constructor(
    private db: DbService,
    private authService: AuthService,
    private util: UtilService
  ) {}

  async postComment(slug: string, body: string) {
    const userId = await this.authService.getCurrentUserId();
    const resultSetHeader = await this.db.postComment(userId, slug, body);
    const commentId = Number(resultSetHeader.insertId);
    const dbComment = await this.db.getComments(userId, commentId);
    const commentData = new CommentData();
    commentData.comment = this.transformToComment(dbComment);
    return commentData;
  }

  async getComments() {
    const currentUserId = await this.authService.getCurrentUserId();
    const dbComments = await this.db.getComments(currentUserId);
    const commentsData = new CommentsData();
    commentsData.comments = dbComments.map((dbComment) => this.transformToComment(dbComment));
    return commentsData;
  }

  async deleteComment(commentId: number) {
    const currentUserId = await this.authService.getCurrentUserId();
    const hasPermissions = await this.authService.hasPermissions([Permission.canDeleteAnyComments]);
    const resultSetHeader = await this.db.deleteArticle(currentUserId, hasPermissions, commentId);
    if (!resultSetHeader.affectedRows) {
      this.util.throw403Error('permissions', "You don't have permission to delete this comment.");
    }
    return { ok: 1 };
  }

  protected transformToComment(dbComment: DbComment): Comment {
    dbComment.createdAt = dbComment.createdAt * 1000;
    dbComment.updatedAt = dbComment.updatedAt * 1000;
    const commentData = pickProperties(new Comment(), dbComment as Omit<DbComment, 'createdAt' | 'updatedAt'>);
    commentData.id = dbComment.commentId;
    commentData.createdAt = new Date(commentData.createdAt).toISOString();
    commentData.updatedAt = new Date(commentData.updatedAt).toISOString();
    const author = pickProperties(new Author(), dbComment as Omit<DbComment, 'following'>);
    author.following = author.following ? true : false;
    commentData.author = author;
    return commentData;
  }
}
