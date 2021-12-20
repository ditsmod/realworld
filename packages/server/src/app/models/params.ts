import { Column } from '@ditsmod/openapi';

import { AppConfigService } from '@service/app-config/config.service';
import { ServerMsg } from '@service/msg/server-msg';
import { VALIDATION_ARGS } from '@service/validation/types';

const config = new AppConfigService();
const serverMsg = new ServerMsg();

export class Params {
  @Column({
    minLength: config.minUserName,
    maxLength: config.maxUserName,
    [VALIDATION_ARGS]: [serverMsg.invalidUserName],
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
