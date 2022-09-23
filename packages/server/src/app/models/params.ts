import { Column } from '@ditsmod/openapi';

import { AppConfigService } from '@service/app-config/config.service';

const config = new AppConfigService();

export class Params {
  @Column({
    minLength: config.minUserName,
    maxLength: config.maxUserName,
    description: `User name should be between ${config.minUserName} and ${config.maxUserName} symbols.`,
  })
  username: string;
  @Column()
  tag: string;
  @Column()
  author: string;
  @Column()
  favorited: string;
  @Column()
  limit: number;
  @Column()
  offset: number;
  @Column()
  slug: string;
  @Column()
  id: number;
}
