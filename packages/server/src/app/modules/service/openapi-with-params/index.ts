import { ProviderBuilder, HttpStatus, type DynamicModule } from '@ditsmod/core';
import { OpenapiModule } from '@ditsmod/openapi';
import { AJV_OPTIONS, ValidationModule, ValidationOptions } from '@ditsmod/openapi-validation';
import { I18nProviders } from '@ditsmod/i18n';
import type { Options } from 'ajv';

import { oasObject } from './oas-object.js';
import { current } from './locales/current/index.js';

export const openapiModuleWithOpts = OpenapiModule.withOpts(oasObject, '');

openapiModuleWithOpts.providersPerApp = [
  ...(openapiModuleWithOpts.providersPerApp || []),
  ...new I18nProviders().i18n({ current }, { defaultLng: 'en' }),
];

export const validationModuleWithOpts = { module: ValidationModule } as DynamicModule;
validationModuleWithOpts.providersPerApp = [
  ...(validationModuleWithOpts.providersPerApp || []),
  ...new ProviderBuilder()
    .useValue<ValidationOptions>(ValidationOptions, { invalidStatus: HttpStatus.UNPROCESSABLE_ENTRY })
    .useValue<Options>(AJV_OPTIONS, { allErrors: true, coerceTypes: true }),
];
