import { Module } from '@ditsmod/core';

import { ServerDict } from '../openapi-with-params/server.dict';

@Module({ providersPerApp: [ServerDict] })
export class MsgModule {}
