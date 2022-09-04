import { Module, PRE_ROUTER_EXTENSIONS } from '@ditsmod/core';

import { AssertService } from './assert.service';
import { ValidationExtension, VALIDATION_EXTENSIONS } from './validation.extension';

@Module({
  providersPerApp: [AssertService],
  extensions: [
    { extension: ValidationExtension, groupToken: VALIDATION_EXTENSIONS, nextToken: PRE_ROUTER_EXTENSIONS, exported: true }
  ],
})
export class ValidationModule {}
