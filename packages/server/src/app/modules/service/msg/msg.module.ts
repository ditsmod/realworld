import { Module } from '@ditsmod/core';

import { ServerDict } from './server.dict';

@Module({ providersPerApp: [ServerDict] })
export class MsgModule {}
