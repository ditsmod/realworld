import { ExtensionsMetaPerApp, Providers } from '@ditsmod/core';
import { OpenapiModule } from '@ditsmod/openapi';
import { ValidationModule } from '@ditsmod/openapi-validation';
import { I18nOptions } from '@ditsmod/i18n';

import { oasObject } from './oas-object';
import { oasOptions } from './oas-options';
import { current } from './locales/current';

export const openapiModuleWithParams = OpenapiModule.withParams(oasObject, '');

openapiModuleWithParams.providersPerApp = [
  ...(openapiModuleWithParams.providersPerApp || []),
  ...new Providers().useValue(I18nOptions, { defaultLng: 'en' }),
  { provide: ExtensionsMetaPerApp, useValue: { oasOptions } },
];

// This need for services per app
// @todo When extensions can be added to providersPerApp, rewrite this code.
for (const group of current) {
  const token = group[0]; // First class uses as group's token
  for (const dict of group) {
    openapiModuleWithParams.providersPerApp.push({ provide: token, useClass: dict, multi: true });
  }
}

export const validationModuleWithParams = ValidationModule.withParams(current);
