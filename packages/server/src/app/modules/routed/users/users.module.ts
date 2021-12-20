import { Module } from '@ditsmod/core';

import { UsersController } from './users.controller';

@Module({ controllers: [UsersController] })
export class UsersModule {}
