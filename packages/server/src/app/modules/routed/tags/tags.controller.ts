import { Controller, Req, Res, Status } from '@ditsmod/core';
import { getContent, OasRoute } from '@ditsmod/openapi';

import { getRequestBody, getResponses } from '@models/oas-helpers';
import { Tags } from './models';

@Controller()
export class TagsController {
  constructor(private res: Res) {}

  @OasRoute('GET', '', [], {
    ...getResponses(Tags, 'Description for response content.', Status.OK, false),
  })
  async getTags() {
    this.res.sendJson([]);
  }
}