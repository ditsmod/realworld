import { injectable } from '@ditsmod/core';

import { MysqlService } from '@service/mysql/mysql.service';
import { AppConfigService } from '@service/app-config/config.service';
import { Database } from '@routed/articles/models';

@injectable()
export class DbService {
  constructor(private mysql: MysqlService, private config: AppConfigService) {}

  async getTags() {
    const db = await this.mysql.getKysely<Database>();

    return db.selectFrom('dict_tags').select('tagName').limit(this.config.maxItemsTagsPerPage).execute() as unknown as {
      tagName: string;
    }[];
  }
}
