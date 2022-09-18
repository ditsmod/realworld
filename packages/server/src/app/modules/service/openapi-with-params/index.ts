import { ExtensionsMetaPerApp } from '@ditsmod/core';
import { DictGroup } from '@ditsmod/i18n';
import { OpenapiModule } from '@ditsmod/openapi';
import { ValidationModule } from '@ditsmod/openapi-validation';

import { oasObject } from './oas-object';
import { oasOptions } from './oas-options';
import { ServerDict } from './server.dict';

export const openapiModuleWithParams = OpenapiModule.withParams(oasObject, '');

openapiModuleWithParams.providersPerApp = [
  ...(openapiModuleWithParams.providersPerApp || []),
  { provide: ExtensionsMetaPerApp, useValue: { oasOptions } },
];

const current: DictGroup[] = [
  [ServerDict],
];

export const validationModuleWithParams = ValidationModule.withParams(current);
