import { edk, Status } from '@ditsmod/core';
import { getContent } from '@ditsmod/openapi';
import { Type } from '@ts-stack/di';
import { OperationObject, ResponseObject, ResponsesObject, RequestBodyObject } from '@ts-stack/openapi-spec';

import { ErrorTemplate } from './errors';

export type Model = Type<edk.AnyObj>;

export function getRequestBody(model: Model, description: string = ''): OperationObject {
  return {
    requestBody: {
      description,
      content: getContent({ mediaType: 'application/json', model }),
    },
  };
}

/**
 * Helper to work with OpenAPI responses (ResponsesObject).
 */
export class Responses {
  private operationObject: OperationObject = { responses: {} };

  constructor(model?: Model, description: string = '', status?: Status) {
    if (model) {
      this.setResponse(model, description, status);
    }
  }

  setResponse(model: Model, description: string = '', status?: Status) {
    this.operationObject.responses![status || Status.OK] = this.getJsonContent(model, description);
    return this;
  }

  get(model?: Model, description: string = '', status?: Status) {
    if (model) {
      this.setResponse(model, description, status);
    }
    return this.operationObject;
  }

  protected getJsonContent(model: Model, description: string): ResponseObject {
    return { content: getContent({ mediaType: 'application/json', model }), description };
  }

  setUnprocessableEnryResponse(description: string = 'If fail.') {
    this.setResponse(ErrorTemplate, description, Status.UNPROCESSABLE_ENTRY);
    return this;
  }

  getUnprocessableEnryResponse(description?: string) {
    this.setUnprocessableEnryResponse(description);
    return this.get();
  }

  setNotFoundResponse(description: string = 'Not found.') {
    this.operationObject.responses![Status.NOT_FOUND] = { description };
    return this;
  }

  getNotFoundResponse(description?: string) {
    this.setNotFoundResponse(description);
    return this.get();
  }

  setNoContentResponse(description: string = 'No Content.') {
    this.operationObject.responses![Status.NO_CONTENT] = { description };
    return this;
  }

  getNoContentResponse(description?: string) {
    this.setNoContentResponse(description);
    return this.get();
  }

  setUnauthorizedResponse() {
    this.operationObject.responses![Status.UNAUTHORIZED] = {
      $ref: '#/components/responses/UnauthorizedError',
    };
    return this;
  }

  getUnauthorizedResponse() {
    this.setUnauthorizedResponse();
    return this.get();
  }
}
