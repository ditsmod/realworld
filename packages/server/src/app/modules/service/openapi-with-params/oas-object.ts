import { XOasObject } from '@ts-stack/openapi-spec';

export const oasObject: XOasObject = {
  openapi: '3.0.0',
  // Here works the servers that are described using this OpenAPI documentation.
  servers: [{ url: 'http://localhost:3000' }],
  info: { title: 'RealWorld example using the Ditsmod application', version: '1.0.0' },
  tags: [
    {
      name: 'users',
    },
    {
      name: 'user',
    },
    {
      name: 'profiles',
    },
    {
      name: 'articles',
    },
    {
      name: 'comments',
    },
    {
      name: 'favorite',
    },
    {
      name: 'tags',
    },
    {
      name: 'NonOasRoutes',
      description:
        'Routes that used `@Route()` decorator. If you want to change this description, ' +
        '[use tags](https://swagger.io/docs/specification/grouping-operations-with-tags/) ' +
        'for `@OasRoute()` imported from @ditsmod/openapi.',
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
              'Taken from [swagger.io](https://swagger.io/docs/specification/authentication/bearer-authentication/)',
          },
        },
      },
    },
  },
};
