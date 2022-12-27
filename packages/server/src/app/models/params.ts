import { property } from '@ditsmod/openapi';

import { AppConfigService } from '@service/app-config/config.service';

const config = new AppConfigService();

export class Params {
  @property({
    minLength: config.minUserName,
    maxLength: config.maxUserName,
    description: `User name should be between ${config.minUserName} and ${config.maxUserName} symbols.`,
  })
  username: string;
  @property()
  tag: string;
  @property()
  author: string;
  @property()
  favorited: string;
  @property()
  limit: number;
  @property()
  offset: number;
  @property()
  slug: string;
  @property()
  id: number;
}
