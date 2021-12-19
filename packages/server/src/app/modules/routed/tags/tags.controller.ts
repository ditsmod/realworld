import { Controller, Req, Res, Status } from '@ditsmod/core';
import { getContent, OasRoute } from '@ditsmod/openapi';

import { Tags } from './models';

@Controller()
export class TagsController {
  constructor(private res: Res) {}

  @OasRoute('GET', '', [], {
    responses: {
      [Status.OK]: {
        description: 'Description for response content',
        content: getContent({ mediaType: 'application/json', model: Tags }),
      },
    },
  })
  async getTags() {
    this.res.sendJson([]);
  }
}