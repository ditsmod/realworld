import { injectable } from '@ditsmod/core';

import { MysqlService } from '#service/mysql/mysql.service.js';
import { AppConfigService } from '#service/app-config/config.service.js';
import { Tables } from '#routed/articles/models.js';

@injectable()
export class DbService {
  constructor(private mysql: MysqlService<Tables>, private config: AppConfigService) {}

  async getTags() {
    return this.mysql
      .select('tagName')
      .from('dict_tags')
      .limit(this.config.maxItemsTagsPerPage)
      .$run<{ tagName: string }[]>();
  }
}
