import { edk, Status } from '@ditsmod/core';
import { getContent } from '@ditsmod/openapi';
import { Type } from '@ts-stack/di';
import { XOperationObject } from '@ts-stack/openapi-spec';

import { ErrorTemplate } from './errors';

export function getErrorTemplate() {
  return {
    description: 'If fail.',
    content: getContent({ mediaType: 'application/json', model: ErrorTemplate }),
  };
}

export function getJsonContent(model: Type<edk.AnyObj>, description: string = '') {
  return { content: getContent({ mediaType: 'application/json', model }), description };
}

export function getRequestBody(model: Type<edk.AnyObj>, description: string = '') {
  const operationObject: XOperationObject = {
    requestBody: {
      description,
      content: getContent({ mediaType: 'application/json', model }),
    },
  };

  return operationObject;
}

/**
 * @param showStatusErr Default - true
 */
export function getResponses(
  model: Type<edk.AnyObj>,
  description: string = '',
  status: Status = Status.OK,
  showStatusErr: boolean = true
) {
  const operationObject: XOperationObject = {
    responses: {
      [status]: {
        description,
        content: getContent({ mediaType: 'application/json', model }),
      },
    },
  };

  if (showStatusErr) {
    operationObject.responses![Status.UNPROCESSABLE_ENTRY] = getErrorTemplate();
  }

  return operationObject;
}

export function getNoContent(): XOperationObject {
  return {
    responses: {
      [Status.NO_CONTENT]: { description: 'No Content.' },
    },
  };
}
