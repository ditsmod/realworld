import { Controller, Req, Res, Status } from '@ditsmod/core';
import { getContent, getParams, OasRoute } from '@ditsmod/openapi';

import { BearerGuard } from '@service/auth/bearer.guard';
import { Params } from '../../../../models/params';
import { CommentData, CommentPostData, CommentsData } from './models';

@Controller()
export class CommentsController {
  constructor(private req: Req, private res: Res) {}

  @OasRoute('POST', '', [BearerGuard], {
    requestBody: {
      description: 'Description for requestBody',
      content: getContent({ mediaType: 'application/json', model: CommentPostData }),
    },
    responses: {
      [Status.OK]: {
        description: 'Description for response content',
        content: getContent({ mediaType: 'application/json', model: CommentData }),
      },
    },
  })
  async postComment() {
    this.res.sendJson(new CommentPostData());
  }

  @OasRoute('GET', '', [], {
    responses: {
      [Status.OK]: {
        description: 'Description for response content',
        content: getContent({ mediaType: 'application/json', model: CommentsData }),
      },
    },
  })
  async getComments() {
    this.res.sendJson(new CommentsData());
  }

  @OasRoute('DELETE', ':id', [BearerGuard], {
    parameters: getParams('path', true, Params, 'id')
  })
  async deleteComment() {
    this.res.send('ok');
  }
}