import { Controller, Req, Res, Status } from '@ditsmod/core';
import { getParams, OasRoute } from '@ditsmod/openapi';

import { BearerGuard } from '@service/auth/bearer.guard';
import { getRequestBody, Responses } from '@models/oas-helpers';
import { Params } from '@models/params';
import { CommentData, CommentPostData, CommentsData } from './models';

@Controller()
export class CommentsController {
  constructor(private req: Req, private res: Res) {}

  @OasRoute('POST', '', [BearerGuard], {
    ...getRequestBody(CommentPostData, 'Description for requestBody.'),
    ...new Responses(CommentData, 'Description for response content.', Status.CREATED)
      .getUnprocessableEnryResponse(),
  })
  async postComment() {
    this.res.sendJson(new CommentPostData());
  }

  @OasRoute('GET', '', [], {
    ...new Responses(CommentData, 'Description for response content.').get(),
  })
  async getComments() {
    this.res.sendJson(new CommentsData());
  }

  @OasRoute('DELETE', ':id', [BearerGuard], {
    parameters: getParams('path', true, Params, 'id'),
    ...new Responses()
      .setNotFoundResponse('Comment nof found.')
      .setUnprocessableEnryResponse()
      .getNoContentResponse(),
  })
  async deleteComment() {
    this.res.send('ok');
  }
}
