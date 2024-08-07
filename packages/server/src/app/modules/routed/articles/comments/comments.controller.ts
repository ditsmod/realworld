import { controller, inject, PATH_PARAMS, pickProperties, Status } from '@ditsmod/core';
import { oasRoute } from '@ditsmod/openapi';
import { HTTP_BODY } from '@ditsmod/body-parser';

import { Permission } from '#shared';
import { BearerGuard } from '#service/auth/bearer.guard.js';
import { OasOperationObject } from '#utils/oas-helpers.js';
import { Params } from '#models/params.js';
import { AuthService } from '#service/auth/auth.service.js';
import { UtilService } from '#service/util/util.service.js';
import { CommentData, CommentPostData, CommentsData, Comment } from './models.js';
import { DbService } from './db.service.js';
import { DbComment } from './types.js';
import { Author } from '../models.js';

@controller()
export class CommentsController {
  constructor(private db: DbService, private authService: AuthService) {}

  @oasRoute('POST', '', [BearerGuard], {
    ...new OasOperationObject()
      .setRequestBody(CommentPostData, 'Description for requestBody.')
      .getResponse(CommentData, 'Description for response content.', Status.CREATED),
  })
  async postComment(@inject(HTTP_BODY) commentPostData: CommentPostData, @inject(PATH_PARAMS) pathParams: any) {
    const userId = await this.authService.getCurrentUserId();
    const slug = pathParams.slug as string;
    const resultSetHeader = await this.db.postComment(userId, slug, commentPostData.comment.body);
    const commentId = Number(resultSetHeader.insertId);
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
  async deleteComment(utils: UtilService, @inject(PATH_PARAMS) pathParams: any) {
    const currentUserId = await this.authService.getCurrentUserId();
    const hasPermissions = await this.authService.hasPermissions([Permission.canDeleteAnyComments]);
    const commentId = pathParams.id as number;
    const resultSetHeader = await this.db.deleteArticle(currentUserId, hasPermissions, commentId);
    if (!resultSetHeader.affectedRows) {
      utils.throw403Error('permissions', "You don't have permission to delete this comment.");
    }
    return { ok: 1 };
  }
}
