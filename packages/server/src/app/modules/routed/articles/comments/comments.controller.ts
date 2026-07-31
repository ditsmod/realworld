import { ctx, HttpStatus } from '@ditsmod/core';
import { oasRoute } from '@ditsmod/openapi';
import { HTTP_BODY } from '@ditsmod/body-parser';
import { controller, PATH_PARAMS } from '@ditsmod/rest';

import { BearerGuard } from '#service/auth/bearer.guard.js';
import { OasOperationObject } from '#utils/oas-helpers.js';
import { ParamsDto } from '#dto/params.dto.js';
import { CommentDataDto, CommentPostDataDto, CommentsDto } from './comments.dto.js';
import { CommentsService } from './comments.service.js';

@controller()
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @oasRoute('POST', '', [BearerGuard], {
    ...new OasOperationObject()
      .setRequestBody(CommentPostDataDto, 'Description for requestBody.')
      .getResponse(CommentDataDto, 'Description for response content.', HttpStatus.CREATED),
  })
  async postComment(
    @ctx(HTTP_BODY) commentPostData: CommentPostDataDto,
    @ctx(PATH_PARAMS) pathParams: Record<'slug', string>
  ) {
    return this.commentsService.postComment(pathParams.slug, commentPostData.comment.body);
  }

  @oasRoute('GET', '', {
    ...new OasOperationObject().getResponse(CommentsDto, 'Description for response content.'),
  })
  async getComments() {
    return this.commentsService.getComments();
  }

  @oasRoute('DELETE', ':id', [BearerGuard], {
    ...new OasOperationObject()
      .setRequiredParams('path', ParamsDto, 'id')
      .setNotFoundResponse('Comment not found.')
      .getNoContentResponse(),
  })
  async deleteComment(@ctx(PATH_PARAMS) pathParams: Record<'id', number>) {
    return this.commentsService.deleteComment(pathParams.id);
  }
}
