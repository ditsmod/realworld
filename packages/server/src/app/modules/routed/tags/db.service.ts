import { injectable } from '@holu/core';
import { injectRepository } from '@holu/typeorm';
import { Repository } from 'typeorm';

import { AppConfigService } from '#service/app-config/config.service.js';
import { TagEntity } from '#entities';

@injectable()
export class DbService {
  constructor(@injectRepository(TagEntity) private tagRepo: Repository<TagEntity>, private config: AppConfigService) {}

  async getTags() {
    const tags = await this.tagRepo.find({
      select: { tagName: true },
      take: this.config.maxItemsTagsPerPage,
    });
    return tags as { tagName: string }[];
  }
}
