import { Controller, Res } from '@ditsmod/core';
import { OasRoute } from '@ditsmod/openapi';

import { OasOperationObject } from '@utils/oas-helpers';
import { DbService } from './db.service';
import { Tags } from './models';

@Controller()
export class TagsController {
  constructor(private res: Res, private db: DbService) {}

  @OasRoute('GET', '', {
    ...new OasOperationObject().getResponse(Tags, 'Description for response content.'),
  })
  async getTags() {
    const dbTags = await this.db.getTags();
    const tags = new Tags();
    tags.tags = dbTags.map(t => t.tagName);
    this.res.sendJson(tags);
  }
}