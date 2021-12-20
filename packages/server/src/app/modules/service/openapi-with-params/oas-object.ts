import { XOasObject } from '@ts-stack/openapi-spec';

export const oasObject: XOasObject = {
  openapi: '3.0.0',
  // Here works the servers that are described using this OpenAPI documentation.
  servers: [{ url: 'http://localhost:3000' }],
  info: { title: 'Your description here', version: '1.0.0' },
  tags: [
    {
      name: 'users',
      description: 'users for https://github.com/gothinkster/realworld ',
    },
    {
      name: 'user',
      description: 'user for https://github.com/gothinkster/realworld ',
    },
    {
      name: 'profiles',
      description: 'profiles for https://github.com/gothinkster/realworld ',
    },
    {
      name: 'articles',
      description: 'articles for https://github.com/gothinkster/realworld ',
    },
    {
      name: 'comments',
      description: 'comments for https://github.com/gothinkster/realworld ',
    },
    {
      name: 'favorite',
      description: 'favorite for https://github.com/gothinkster/realworld ',
    },
    {
      name: 'tags',
      description: 'tags for https://github.com/gothinkster/realworld ',
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
              'Taken from [swagger.io](https://swagger.io/docs/specification/authentication/cookie-authentication/)',
          },
        },
      },
    },
  },
};
