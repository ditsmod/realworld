import { Module } from '@ditsmod/core';

import { UtilService } from './util.service';

@Module({ providersPerApp: [UtilService] })
export class UtilModule {}
