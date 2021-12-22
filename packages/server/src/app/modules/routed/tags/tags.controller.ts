import { Controller, Res } from '@ditsmod/core';
import { OasRoute } from '@ditsmod/openapi';

import { Responses } from '@models/oas-helpers';
import { Tags } from './models';

@Controller()
export class TagsController {
  constructor(private res: Res) {}

  @OasRoute('GET', '', [], {
    ...new Responses(Tags, 'Description for response content.').get(),
  })
  async getTags() {
    this.res.sendJson([]);
  }
}