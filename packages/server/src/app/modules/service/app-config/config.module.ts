import { Module } from '@ditsmod/core';

import { AppConfigService } from './config.service';

@Module({
  providersPerApp: [AppConfigService]
})
export class ConfigModule {}