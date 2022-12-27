import { controller, pickProperties, Req, Status } from '@ditsmod/core';
import { oasRoute } from '@ditsmod/openapi';

import { Permission } from '@shared';
import { BearerGuard } from '@service/auth/bearer.guard';
import { OasOperationObject } from '@utils/oas-helpers';
import { Params } from '@models/params';
import { AuthService } from '@service/auth/auth.service';
import { UtilService } from '@service/util/util.service';
import { CommentData, CommentPostData, CommentsData, Comment } from './models';
import { DbService } from './db.service';
import { DbComment } from './types';
import { Author } from '../models';

@controller()
export class CommentsController {
  constructor(
    private req: Req,
    private db: DbService,
    private utils: UtilService,
    private authService: AuthService
  ) {}

  @oasRoute('POST', '', [BearerGuard], {
    ...new OasOperationObject()
      .setRequestBody(CommentPostData, 'Description for requestBody.')
      .getResponse(CommentData, 'Description for response content.', Status.CREATED),
  })
  async postComment() {
    const userId = await this.authService.getCurrentUserId();
    const commentPostData = this.req.body as CommentPostData;
    const slug = this.req.pathParams.slug as string;
    const okPacket = await this.db.postComment(userId, slug, commentPostData.comment.body);
    const commentId = okPacket.insertId;
    const dbComment = await this.db.getComments(userId, commentId);
    const commentData = new CommentData();
    commentData.comment = this.transformToComment(dbComment);
    return commentData;
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

  @oasRoute('GET', '', {
    ...new OasOperationObject().getResponse(CommentsData, 'Description for response content.'),
  })
  async getComments() {
    const currentUserId = await this.authService.getCurrentUserId();
    const dbComments = await this.db.getComments(currentUserId);
    const commentsData = new CommentsData();
    commentsData.comments = dbComments.map((dbComment) => this.transformToComment(dbComment));
    return commentsData;
  }

  @oasRoute('DELETE', ':id', [BearerGuard], {
    ...new OasOperationObject()
      .setRequiredParams('path', Params, 'id')
      .setNotFoundResponse('Comment nof found.')
      .getNoContentResponse(),
  })
  async deleteComment() {
    const currentUserId = await this.authService.getCurrentUserId();
    const hasPermissions = await this.authService.hasPermissions([Permission.canDeleteAnyComments]);
    const commentId = this.req.pathParams.id as number;
    const okPacket = await this.db.deleteArticle(currentUserId, hasPermissions, commentId);
    if (!okPacket.affectedRows) {
      this.utils.throw403Error('permissions', `You don't have permission to delete this comment.`);
    }
    return { ok: 1 };
  }
}
