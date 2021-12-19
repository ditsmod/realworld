import { Module } from '@ditsmod/core';
import { OasOptions } from '@ditsmod/openapi';

import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  extensionsMeta: { oasOptions: { tags: ['users'] } as OasOptions },
})
export class UsersModule {}
