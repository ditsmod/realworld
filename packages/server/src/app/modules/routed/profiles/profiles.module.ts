import { Module } from '@ditsmod/core';
import { OasOptions } from '@ditsmod/openapi';

import { ProfilesController } from './profiles.controller';

@Module({
  controllers: [ProfilesController],
  extensionsMeta: { oasOptions: { tags: ['profiles'] } as OasOptions },
})
export class ProfilesModule {}