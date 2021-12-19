import { Module } from '@ditsmod/core';
import { OasOptions } from '@ditsmod/openapi';

import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  extensionsMeta: { oasOptions: { tags: ['user'] } as OasOptions },
})
export class UserModule {}
