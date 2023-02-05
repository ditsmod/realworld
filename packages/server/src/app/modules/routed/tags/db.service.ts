import { injectable } from '@ditsmod/core';

import { MysqlService } from '@service/mysql/mysql.service';
import { AppConfigService } from '@service/app-config/config.service';

@injectable()
export class DbService {
  constructor(private mysql: MysqlService, private config: AppConfigService) {}

  async getTags() {
    const sql = `select tagName from dict_tags limit ${this.config.maxItemsTagsPerPage}`;
    const { rows } = await this.mysql.query(sql);
    return rows as { tagName: string }[];
  }
}
