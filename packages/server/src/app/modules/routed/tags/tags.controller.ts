import { controller } from '@ditsmod/core';
import { oasRoute } from '@ditsmod/openapi';

import { OasOperationObject } from '@utils/oas-helpers';
import { DbService } from './db.service';
import { Tags } from './models';

@controller()
export class TagsController {
  constructor(private db: DbService) {}

  @oasRoute('GET', '', {
    ...new OasOperationObject().getResponse(Tags, 'Description for response content.'),
  })
  async getTags() {
    const dbTags = await this.db.getTags();
    const tags = new Tags();
    tags.tags = dbTags.map(t => t.tagName);
    return tags;
  }
}