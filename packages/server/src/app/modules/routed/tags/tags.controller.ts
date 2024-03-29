import { controller } from '@ditsmod/core';
import { oasRoute } from '@ditsmod/openapi';

import { OasOperationObject } from '#utils/oas-helpers.js';
import { DbService } from './db.service.js';
import { Tags } from './models.js';

@controller()
export class TagsController {
  @oasRoute('GET', '', {
    ...new OasOperationObject().getResponse(Tags, 'Description for response content.'),
  })
  async getTags(db: DbService) {
    const dbTags = await db.getTags();
    const tags = new Tags();
    tags.tags = dbTags.map((t) => t.tagName);
    return tags;
  }
}
