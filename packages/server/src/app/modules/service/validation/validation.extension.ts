import { edk, HTTP_INTERCEPTORS } from '@ditsmod/core';
import { BODY_PARSER_EXTENSIONS } from '@ditsmod/body-parser';
import { isReferenceObject, OasRouteMeta } from '@ditsmod/openapi';
import { Injectable, ReflectiveInjector } from '@ts-stack/di';

import { ValidationRouteMeta } from './types';
import { ValidationInterceptor } from './validation.interceptor';

@Injectable()
export class ValidationExtension implements edk.Extension<void> {
  private inited: boolean;

  constructor(private injectorPerApp: ReflectiveInjector, private extensionsManager: edk.ExtensionsManager) {}

  async init() {
    if (this.inited) {
      return;
    }

    await this.extensionsManager.init(BODY_PARSER_EXTENSIONS);
    await this.filterParameters();
    this.inited = true;
  }

  protected async filterParameters() {
    const metadataPerMod2Arr = await this.extensionsManager.init(edk.ROUTES_EXTENSIONS);

    metadataPerMod2Arr.forEach((metadataPerMod2) => {
      const { aControllersMetadata2, providersPerMod } = metadataPerMod2;
      aControllersMetadata2.forEach(({ providersPerRou }) => {
        const injectorPerMod = this.injectorPerApp.resolveAndCreateChild(providersPerMod);
        const mergedPerRou = [...metadataPerMod2.providersPerRou, ...providersPerRou];
        const injectorPerRou = injectorPerMod.resolveAndCreateChild(mergedPerRou);
        const validationRouteMeta = injectorPerRou.get(OasRouteMeta) as ValidationRouteMeta;
        validationRouteMeta.parameters = [];
        if (validationRouteMeta.operationObject?.parameters?.length) {
          validationRouteMeta.operationObject.parameters.forEach((p) => {
            if (!isReferenceObject(p) && p.schema) {
              validationRouteMeta.parameters.push(p);
            }
          });
        }

        const requestBody = validationRouteMeta.operationObject?.requestBody;
        if (
          requestBody &&
          !isReferenceObject(requestBody) &&
          requestBody.content?.['application/json']?.schema?.properties
        ) {
          validationRouteMeta.requestBodyProperties = requestBody.content['application/json'].schema.properties;
        }

        if (validationRouteMeta.parameters.length || validationRouteMeta.requestBodyProperties) {
          metadataPerMod2.providersPerRou.push({ provide: ValidationRouteMeta, useExisting: edk.RouteMeta });
          metadataPerMod2.providersPerReq.push({
            provide: HTTP_INTERCEPTORS,
            useClass: ValidationInterceptor,
            multi: true,
          });
        }
      });
    });
  }
}
