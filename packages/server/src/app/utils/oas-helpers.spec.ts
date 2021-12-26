import 'reflect-metadata';
import { Status } from '@ditsmod/core';
import { OperationObject } from '@ts-stack/openapi-spec';

import { UserSessionData } from '@routed/users/models';
import { OasOperationObject } from './oas-helpers';

describe('oas-helpers', () => {
  describe('Responses', () => {
    it('should returns entered data', () => {
      const operationObject = new OasOperationObject(UserSessionData, 'After registration, this data is sent to the client.', Status.CREATED).getResponse();
      const expectedOjb: OperationObject = {
        responses: {
          [Status.CREATED]: {
            description: 'After registration, this data is sent to the client.'
          }
        }
      };
      expect(operationObject).toMatchObject(expectedOjb);
    })
  });
});
