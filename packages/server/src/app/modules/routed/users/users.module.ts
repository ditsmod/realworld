import { Module } from '@ditsmod/core';

import { DbService } from './db.service';
import { UsersController } from './users.controller';

@Module({ controllers: [UsersController], providersPerReq: [DbService] })
export class UsersModule {}
