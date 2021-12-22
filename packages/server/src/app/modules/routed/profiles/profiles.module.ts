import { Module } from '@ditsmod/core';
import { OasOptions } from '@ditsmod/openapi';

import { DbService } from './db.service';
import { ProfilesController } from './profiles.controller';

@Module({
  controllers: [ProfilesController],
  providersPerReq: [DbService],
  extensionsMeta: { oasOptions: { tags: ['profiles'] } as OasOptions },
})
export class ProfilesModule {}