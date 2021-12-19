import { XOasObject } from '@ts-stack/openapi-spec';

export const oasObject: XOasObject = {
  openapi: '3.0.0',
  // Here works the servers that are described using this OpenAPI documentation.
  servers: [{ url: 'http://localhost:3000' }],
  info: { title: 'Your description here', version: '1.0.0' },
  tags: [
    {
      name: 'NonOasRoutes',
      description:
        'Routes that used `@Route()` decorator. If you want to change this description, ' +
        '[use tags](https://swagger.io/docs/specification/grouping-operations-with-tags/) ' +
        'for `@OasRoute()` imported from @ditsmod/openapi.',
    },
    {
      name: 'demo',
      description:
        'OpenAPI specefication routes. This routes used `@OasRoute()` decorator ' +
        'imported from @ditsmod/openapi. Setting for this routes you can find in ' +
        '`packages/server/src/app/modules/service/openapi-with-params/oas-object.ts`.',
    },
    {
      name: 'OasDocs',
      description: 'Routes used to service OpenAPI documentation',
    },
  ],
  components: {
    responses: {
      UnauthorizedError: {
        description: 'Authentication information is missing or invalid',
        headers: {
          Unauthorized: {
            schema: { type: 'string' },
            description:
              'Taken from [swagger.io](https://swagger.io/docs/specification/authentication/cookie-authentication/)',
          },
        },
      },
    },
  },
};
