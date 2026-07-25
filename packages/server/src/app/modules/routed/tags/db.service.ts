import { injectable } from '@ditsmod/core';
import { injectRepository } from '@ditsmod/typeorm';
import { Repository } from 'typeorm';

import { AppConfigService } from '#service/app-config/config.service.js';
import { Tag } from '#app/entities/index.js';

@injectable()
export class DbService {
  constructor(@injectRepository(Tag) private tagRepo: Repository<Tag>, private config: AppConfigService) {}

  async getTags() {
    const tags = await this.tagRepo.find({
      select: { tagName: true },
      take: this.config.maxItemsTagsPerPage,
    });
    return tags as { tagName: string }[];
  }
}
