import { injectable } from '@ditsmod/core';

import { DbService } from './db.service.js';
import { Tags } from './tags.dto.js';

@injectable()
export class TagsService {
  constructor(private db: DbService) {}

  async getTags() {
    const dbTags = await this.db.getTags();
    const tags = new Tags();
    tags.tags = dbTags.map((t) => t.tagName);
    return tags;
  }
}
