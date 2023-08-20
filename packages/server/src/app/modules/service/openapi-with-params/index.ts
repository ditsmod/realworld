import { Providers, Status } from '@ditsmod/core';
import { OpenapiModule } from '@ditsmod/openapi';
import { AJV_OPTIONS, ValidationModule, ValidationOptions } from '@ditsmod/openapi-validation';
import { I18nProviders } from '@ditsmod/i18n';
import type { Options } from 'ajv';

import { oasObject } from './oas-object';
import { current } from './locales/current';

export const openapiModuleWithParams = OpenapiModule.withParams(oasObject, '');

openapiModuleWithParams.providersPerApp = [
  ...(openapiModuleWithParams.providersPerApp || []),
  ...new I18nProviders().i18n({ current }, { defaultLng: 'en' }),
];

export const validationModuleWithParams = ValidationModule.withParams(current);
validationModuleWithParams.providersPerApp = [
  ...(validationModuleWithParams.providersPerApp || []),
  ...new Providers()
    .useValue<ValidationOptions>(ValidationOptions, { invalidStatus: Status.UNPROCESSABLE_ENTRY })
    .useValue<Options>(AJV_OPTIONS, { allErrors: true, coerceTypes: true }),
];
