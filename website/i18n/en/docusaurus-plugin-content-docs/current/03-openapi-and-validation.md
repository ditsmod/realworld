# OpenAPI and validation

Validation of input data in HTTP requests is based on metadata transmitted to `@oasRoute()` (OAS is "OpenAPI Specification"). Before starting the web server, [ValidationExtension][1] analyzes this metadata, and if it is declared in a particular route that the request may come with parameters or the body, [ValidationInterceptor][2] is added to this route.

However, not all metadata accepted in `@oasRoute()` is taken into account for validation. The following is currently being tested:

1. `number`: availability of parameter, minimum and maximum value;
2. `string`: availability of parameter, minimum and maximum length;
3. `boolean`: availability of parameter and valid values (0, 1, true, false);
4. `object`: availability of parameter; a recursive pass is made for each property with the check described in all items of this list (`number`, `string`, `boolean`, `object`, `array`);
4. `array`: availability of parameter, the minimum and maximum number of items, as well as the check described in all items of this list (`number`, `string`, `boolean`, `object`, `array`) for each items.

## OasOperationObject

To facilitate the transfer of metadata to `@oasRoute()`, a helper [OasOperationObject][3] has been created. Each method in this class is prefixed with `set*` or `get*`. Each of the methods with the prefix `set*` returns a reference to the instance of `OasOperationObject`, so you can call several methods in a chain:

```ts
@oasRoute('GET', ':slug', [], {
  ...new OasOperationObject()
    .setOptionalParams('query', Params, 'tag', 'author', 'limit', 'offset')
    .setResponse(ArticleItem, 'Description for response content.')
    .setUnauthorizedResponse()
    .getNotFoundResponse('The article not found.'),
})
async getArticle() {
  // ...
}
```

As you can see, methods with the prefix `set*` are called three times and at the very end - once with the prefix `get*`. This is an important point: "Each use of the `OasOperationObject` instance must end with a method call with the prefix `get*`".

Note that `Params` and `ArticleItem` here are the classes that act here as data models from which the `OasOperationObject` helper reads metadata. To pin metadata for each model, use the `@property()` decorator:

```ts
import { property } from '@ditsmod/openapi';

export class ArticleItem {
  @property()
  article: Article;
}
```




[1]: https://github.com/ditsmod/realworld/blob/main/packages/server/src/app/modules/service/validation/validation.extension.ts
[2]: https://github.com/ditsmod/realworld/blob/main/packages/server/src/app/modules/service/validation/validation.interceptor.ts
[3]: https://github.com/ditsmod/realworld/blob/main/packages/server/src/app/utils/oas-helpers.ts
