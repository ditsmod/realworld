import { Module } from '@ditsmod/core';

import { ServerMsg } from './server-msg';

@Module({ providersPerApp: [ServerMsg] })
export class MsgModule {}
