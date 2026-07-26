import { ctx, HttpStatus } from '@ditsmod/core';
import { oasRoute } from '@ditsmod/openapi';
import { HTTP_BODY } from '@ditsmod/body-parser';
import { controller, PATH_PARAMS } from '@ditsmod/rest';

import { BearerGuard } from '#service/auth/bearer.guard.js';
import { OasOperationObject } from '#utils/oas-helpers.js';
import { Params } from '#dto/params.dto.js';
import { CommentData, CommentPostData, CommentsData } from './comments.dto.js';
import { CommentsService } from './comments.service.js';

@controller()
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @oasRoute('POST', '', [BearerGuard], {
    ...new OasOperationObject()
      .setRequestBody(CommentPostData, 'Description for requestBody.')
      .getResponse(CommentData, 'Description for response content.', HttpStatus.CREATED),
  })
  async postComment(@ctx(HTTP_BODY) commentPostData: CommentPostData, @ctx(PATH_PARAMS) pathParams: any) {
    return this.commentsService.postComment(pathParams.slug as string, commentPostData.comment.body);
  }

  @oasRoute('GET', '', {
    ...new OasOperationObject().getResponse(CommentsData, 'Description for response content.'),
  })
  async getComments() {
    return this.commentsService.getComments();
  }

  @oasRoute('DELETE', ':id', [BearerGuard], {
    ...new OasOperationObject()
      .setRequiredParams('path', Params, 'id')
      .setNotFoundResponse('Comment nof found.')
      .getNoContentResponse(),
  })
  async deleteComment(@ctx(PATH_PARAMS) pathParams: any) {
    return this.commentsService.deleteComment(pathParams.id as number);
  }
}
