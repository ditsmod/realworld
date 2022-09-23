import { OpenapiModule } from '@ditsmod/openapi';
import { ValidationModule } from '@ditsmod/openapi-validation';
import { I18nProviders } from '@ditsmod/i18n';

import { oasObject } from './oas-object';
import { current } from './locales/current';

export const openapiModuleWithParams = OpenapiModule.withParams(oasObject, '');

openapiModuleWithParams.providersPerApp = [
  ...(openapiModuleWithParams.providersPerApp || []),
  ...new I18nProviders().i18n({ current }, { defaultLng: 'en' }),
];

export const validationModuleWithParams = ValidationModule.withParams(current);
