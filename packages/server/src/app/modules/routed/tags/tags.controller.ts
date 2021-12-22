import { Controller, Res } from '@ditsmod/core';
import { OasRoute } from '@ditsmod/openapi';

import { getResponseWithModel } from '@models/oas-helpers';
import { Tags } from './models';

@Controller()
export class TagsController {
  constructor(private res: Res) {}

  @OasRoute('GET', '', [], {
    ...getResponseWithModel(Tags, 'Description for response content.'),
  })
  async getTags() {
    this.res.sendJson([]);
  }
}