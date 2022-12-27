import { AnyObj, Status } from '@ditsmod/core';
import { getContent, Parameters } from '@ditsmod/openapi';
import { Type } from '@ditsmod/core';
import { OperationObject, ResponseObject } from '@ts-stack/openapi-spec';

import { ErrorTemplate } from '@models/errors';

export type Model = Type<AnyObj>;
type RequiredParamsIn = 'query' | 'header' | 'path' | 'cookie';
type OptionalParamsIn = 'query' | 'header' | 'cookie';
type KeyOf<T extends Model> = Extract<keyof T['prototype'], string>;
type KeysOf<T extends Model> = [KeyOf<T>, ...KeyOf<T>[]];

/**
 * Helper to work with OpenAPI OperationObject.
 */
export class OasOperationObject {
  private operationObject: OperationObject = { responses: {} };
  private params = new Parameters();

  setRequiredParams<T extends Model>(paramsIn: RequiredParamsIn, model: T, ...params: KeysOf<T>): this {
    this.params.required(paramsIn, model, ...params);
    return this;
  }

  getRequiredParams<T extends Model>(paramsIn: RequiredParamsIn, model: T, ...params: KeysOf<T>) {
    this.setRequiredParams(paramsIn, model, ...params);
    return this.getResponse();
  }

  setOptionalParams<T extends Model>(paramsIn: OptionalParamsIn, model: T, ...params: KeysOf<T>): this {
    this.params.optional(paramsIn, model, ...params);
    return this;
  }

  getOptionalParams<T extends Model>(paramsIn: OptionalParamsIn, model: T, ...params: KeysOf<T>) {
    this.setOptionalParams(paramsIn, model, ...params);
    return this.getResponse();
  }

  setRequestBody(model: Model, description: string = ''): this {
    this.operationObject.requestBody = {
      description,
      content: getContent({ mediaType: 'application/json', model }),
    };

    return this;
  }

  getRequestBody(model: Model, description: string = '') {
    this.setRequestBody(model, description);
    return this.getResponse();
  }

  setResponse(model: Model, description: string = '', status?: Status) {
    this.operationObject.responses![status || Status.OK] = this.getJsonContent(model, description);
    return this;
  }

  getResponse(model?: Model, description: string = '', status?: Status) {
    if (model) {
      this.setResponse(model, description, status);
    }

    this.setParamsAndDefaultResponses();
    return this.operationObject;
  }

  protected setParamsAndDefaultResponses(setDefaults: boolean = true) {
    const parameters = this.params.getParams();
    this.operationObject.parameters = parameters;

    if (setDefaults) {
      if (parameters.length) {
        if (!this.operationObject.responses![Status.NOT_FOUND]) {
          this.setNotFoundResponse();
        }
        if (!this.operationObject.responses![Status.UNPROCESSABLE_ENTRY]) {
          this.setUnprocessableEnryResponse();
        }
      }
      if (this.operationObject.requestBody) {
        if (!this.operationObject.responses![Status.UNPROCESSABLE_ENTRY]) {
          this.setUnprocessableEnryResponse('If requested body validation fail.');
        }
      }
    }
  }

  protected getJsonContent(model: Model, description: string): ResponseObject {
    return { content: getContent({ mediaType: 'application/json', model }), description };
  }

  setUnprocessableEnryResponse(description: string = 'If validation fail.') {
    this.setResponse(ErrorTemplate, description, Status.UNPROCESSABLE_ENTRY);
    return this;
  }

  getUnprocessableEnryResponse(description?: string) {
    this.setUnprocessableEnryResponse(description);
    return this.getResponse();
  }

  setNotFoundResponse(description: string = 'Not found.') {
    this.operationObject.responses![Status.NOT_FOUND] = { description };
    return this;
  }

  getNotFoundResponse(description?: string) {
    this.setNotFoundResponse(description);
    return this.getResponse();
  }

  setNoContentResponse(description: string = 'No Content.') {
    this.operationObject.responses![Status.NO_CONTENT] = { description };
    return this;
  }

  getNoContentResponse(description?: string) {
    this.setNoContentResponse(description);
    return this.getResponse();
  }

  setUnauthorizedResponse() {
    this.operationObject.responses![Status.UNAUTHORIZED] = {
      $ref: '#/components/responses/UnauthorizedError',
    };
    return this;
  }

  getUnauthorizedResponse() {
    this.setUnauthorizedResponse();
    return this.getResponse();
  }
}
