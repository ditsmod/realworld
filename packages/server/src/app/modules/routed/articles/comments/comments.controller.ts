import { Controller, Req, Res, Status } from '@ditsmod/core';
import { getParams, OasRoute } from '@ditsmod/openapi';

import { BearerGuard } from '@service/auth/bearer.guard';
import { getNoContentResponse, getRequestBody, getResponseWithModel } from '@models/oas-helpers';
import { Params } from '@models/params';
import { CommentData, CommentPostData, CommentsData } from './models';

@Controller()
export class CommentsController {
  constructor(private req: Req, private res: Res) {}

  @OasRoute('POST', '', [BearerGuard], {
    ...getRequestBody(CommentPostData, 'Description for requestBody.'),
    responses: { ...getResponseWithModel(CommentData, 'Description for response content.', Status.CREATED) },
  })
  async postComment() {
    this.res.sendJson(new CommentPostData());
  }

  @OasRoute('GET', '', [], {
    responses: { ...getResponseWithModel(CommentData, 'Description for response content.') },
  })
  async getComments() {
    this.res.sendJson(new CommentsData());
  }

  @OasRoute('DELETE', ':id', [BearerGuard], {
    parameters: getParams('path', true, Params, 'id'),
    ...getNoContentResponse(),
  })
  async deleteComment() {
    this.res.send('ok');
  }
}
