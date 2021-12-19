import { edk, Module } from '@ditsmod/core';

import { AssertService } from './assert.service';
import { ValidationExtension } from './validation.extension';

@Module({
  providersPerApp: [AssertService],
  extensions: [[edk.PRE_ROUTER_EXTENSIONS, edk.PRE_ROUTER_EXTENSIONS, ValidationExtension, true]],
})
export class ValidationModule {}
