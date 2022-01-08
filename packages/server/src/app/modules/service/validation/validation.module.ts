import { Module, PRE_ROUTER_EXTENSIONS } from '@ditsmod/core';

import { AssertService } from './assert.service';
import { ValidationExtension, VALIDATION_EXTENSIONS } from './validation.extension';

@Module({
  providersPerApp: [AssertService],
  extensions: [[PRE_ROUTER_EXTENSIONS, VALIDATION_EXTENSIONS, ValidationExtension, true]],
})
export class ValidationModule {}
