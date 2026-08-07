import { injectable } from '@holu/core';

import { DbService } from './db.service.js';
import { TagsDto } from './tags.dto.js';

@injectable()
export class TagsService {
  constructor(private db: DbService) {}

  async getTags() {
    const dbTags = await this.db.getTags();
    const tags = new TagsDto();
    tags.tags = dbTags.map((t) => t.tagName);
    return tags;
  }
}
