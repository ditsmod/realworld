import { Controller, edk, Req, Res, Status } from '@ditsmod/core';
import { getParams, OasRoute } from '@ditsmod/openapi';

import { Permission } from '@shared';
import { BearerGuard } from '@service/auth/bearer.guard';
import { getRequestBody, Responses } from '@utils/oas-helpers';
import { Params } from '@models/params';
import { AuthService } from '@service/auth/auth.service';
import { UtilService } from '@service/util/util.service';
import { CommentData, CommentPostData, CommentsData, Comment } from './models';
import { DbService } from './db.service';
import { DbComment } from './types';
import { Author } from '../models';

@Controller()
export class CommentsController {
  constructor(
    private req: Req,
    private res: Res,
    private db: DbService,
    private utils: UtilService,
    private authService: AuthService
  ) {}

  @OasRoute('POST', '', [BearerGuard], {
    ...getRequestBody(CommentPostData, 'Description for requestBody.'),
    ...new Responses(CommentData, 'Description for response content.', Status.CREATED).getUnprocessableEnryResponse(),
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
    this.res.sendJson(commentData);
  }

  protected transformToComment(dbComment: DbComment): Comment {
    const commentData = edk.pickProperties(new Comment(), dbComment);
    commentData.id = dbComment.commentId;
    const author = edk.pickProperties(new Author(), dbComment as Omit<DbComment, 'following'>);
    author.following = author.following ? true : false;
    commentData.author = author;
    return commentData;
  }

  @OasRoute('GET', '', [], {
    ...new Responses(CommentsData, 'Description for response content.').get(),
  })
  async getComments() {
    const currentUserId = await this.authService.getCurrentUserId();
    const dbComments = await this.db.getComments(currentUserId);
    const commentsData = new CommentsData();
    commentsData.comments = dbComments.map(dbComment => this.transformToComment(dbComment));
    this.res.sendJson(commentsData);
  }

  @OasRoute('DELETE', ':id', [BearerGuard], {
    parameters: getParams('path', true, Params, 'id'),
    ...new Responses().setNotFoundResponse('Comment nof found.').setUnprocessableEnryResponse().getNoContentResponse(),
  })
  async deleteComment() {
    const currentUserId = await this.authService.getCurrentUserId();
    const hasPermissions = await this.authService.hasPermissions([Permission.canDeleteAnyComments]);
    const commentId = this.req.pathParams.id as number;
    const okPacket = await this.db.deleteArticle(currentUserId, hasPermissions, commentId);
    if (!okPacket.affectedRows) {
      this.utils.throw403Error('permissions', `You don't have permission to delete this comment.`);
    }
    this.res.sendJson({ ok: 1 });
  }
}
