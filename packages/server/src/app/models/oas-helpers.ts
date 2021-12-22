import { edk, Status } from '@ditsmod/core';
import { getContent } from '@ditsmod/openapi';
import { Type } from '@ts-stack/di';
import { OperationObject, ResponsesObject } from '@ts-stack/openapi-spec';

import { ErrorTemplate } from './errors';

export type Model = Type<edk.AnyObj>;

export function getJsonContent(model: Model, description: string = '') {
  return { content: getContent({ mediaType: 'application/json', model }), description };
}

export function getRequestBody(model: Model, description: string = ''): OperationObject {
  return {
    requestBody: {
      ...getJsonContent(model, description),
    },
  };
}

/**
 * @param showStatusErr Default - true
 */
export function getResponseWithModel(model: Model, description: string = '', status?: Status): ResponsesObject {
  return {
    [status || Status.OK]: getJsonContent(model, description),
  };
}

export function getUnprocessableEnryResponse(description: string = 'If fail.'): ResponsesObject {
  return getResponseWithModel(ErrorTemplate, description, Status.UNPROCESSABLE_ENTRY);
}

export function getNoContentResponse(): ResponsesObject {
  return {
    [Status.NO_CONTENT]: { description: 'No Content.' },
  };
}

export function getNotFoundResponse(message?: string): ResponsesObject {
  return {
    [Status.NOT_FOUND]: { description: message || 'Not found.' },
  };
}

export function getUnauthorizedResponse(): ResponsesObject {
  return {
    [Status.UNAUTHORIZED]: {
      $ref: '#/components/responses/UnauthorizedError',
    },
  };
}
