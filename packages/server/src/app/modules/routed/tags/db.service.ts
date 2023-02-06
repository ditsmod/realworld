import { injectable } from '@ditsmod/core';

import { MysqlService } from '@service/mysql/mysql.service';
import { AppConfigService } from '@service/app-config/config.service';
import { Tables } from '@routed/articles/models';

@injectable()
export class DbService {
  constructor(private mysql: MysqlService<Tables>, private config: AppConfigService) {}

  async getTags() {
    const sql = `select tagName from dict_tags limit ${this.config.maxItemsTagsPerPage}`;
    const { rows } = await this.mysql.query(sql);
    return rows as { tagName: string }[];
  }
}
