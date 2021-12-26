import { Module } from '@ditsmod/core';
import { OasOptions } from '@ditsmod/openapi';

import { DbService } from './db.service';
import { TagsController } from './tags.controller';

@Module({
  controllers: [TagsController],
  providersPerReq: [DbService],
  extensionsMeta: {
    oasOptions: {
      tags: ['tags'],
    } as OasOptions,
  },
})
export class TagsModule {}
