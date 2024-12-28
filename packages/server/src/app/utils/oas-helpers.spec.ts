import { Status } from '@ditsmod/core';
import { describe, it, expect } from 'vitest';

import { UserSessionData } from '#routed/users/models.js';
import { OasOperationObject } from './oas-helpers.js';

describe('oas-helpers', () => {
  describe('Responses', () => {
    it('should returns entered data', () => {
      const operationObject = new OasOperationObject().getResponse(UserSessionData, 'After registration, this data is sent to the client.', Status.CREATED);
      const expectedOjb = {
        responses: {
          [Status.CREATED]: {
            description: 'After registration, this data is sent to the client.'
          }
        }
      };
      expect(operationObject).toMatchObject(expectedOjb);
    });
  });
});
