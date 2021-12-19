import { Module } from '@ditsmod/core';
import { OasOptions } from '@ditsmod/openapi';

import { TagsController } from './tags.controller';

@Module({
  controllers: [TagsController],
  extensionsMeta: {
    oasOptions: {
      tags: ['tags'],
    } as OasOptions,
  },
})
export class TagsModule {}
