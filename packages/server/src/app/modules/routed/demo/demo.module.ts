import { Module } from '@ditsmod/core';

import { DemoController } from './demo.controller';

@Module({ controllers: [DemoController] })
export class DemoModule {}
