import { Property } from '@ditsmod/openapi';

import { AppConfigService } from '@service/app-config/config.service';

const config = new AppConfigService();

export class Params {
  @Property({
    minLength: config.minUserName,
    maxLength: config.maxUserName,
    description: `User name should be between ${config.minUserName} and ${config.maxUserName} symbols.`,
  })
  username: string;
  @Property()
  tag: string;
  @Property()
  author: string;
  @Property()
  favorited: string;
  @Property()
  limit: number;
  @Property()
  offset: number;
  @Property()
  slug: string;
  @Property()
  id: number;
}
