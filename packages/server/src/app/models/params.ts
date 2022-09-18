import { Column } from '@ditsmod/openapi';
import { getInvalidArgs } from '@ditsmod/openapi-validation';

import { AppConfigService } from '@service/app-config/config.service';
import { ServerDict } from '@service/openapi-with-params/server.dict';

const config = new AppConfigService();

export class Params {
  @Column({
    minLength: config.minUserName,
    maxLength: config.maxUserName,
    ...getInvalidArgs(ServerDict, 'invalidUserName'),
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
