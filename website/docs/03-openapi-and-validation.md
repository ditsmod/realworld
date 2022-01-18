# OpenAPI та валідація

Валідація вхідних даних у HTTP-запитах працює на основі метаданих, що передаються в `@OasRoute()` (OAS - це скорочення від "OpenAPI Specification"). Перед стартом веб-сервера, [ValidationExtension][1] аналізує ці метадані, і якщо в конкретному роуті задекларовано, що запит може приходити із параметрами чи тілом запиту, в цей роут додається [ValidationInterceptor][2].

Щоправда, не усі метадані, які приймаються у `@OasRoute()`, беруться до уваги для валідації. На даний момент перевіряється таке:

1. `number`: наявність параметра, мінімальне та максимальне значення;
2. `string`: наявність параметра, мінімальна та максимальна довжина;
3. `boolean`: наявність параметра та допустимі значення (0, 1, true, false);
4. `object`: наявність параметра; робиться рекурсивний прохід по кожній властивості з перевіркою, описаною в усіх пунктах цього списку (`number`, `string`, `boolean`, `object`, `array`);
4. `array`: наявність параметра, мінімальна та максимальна кількість елементів, а також відбувається перевірка, описана в усіх пунктах цього списку (`number`, `string`, `boolean`, `object`, `array`) для кожного елемента.

## OasOperationObject

Для спрощення передачі метаданих до `@OasRoute()`, створено хелпер [OasOperationObject][3]. Кожен метод цього класа має префікс `set*` або `get*`. Кожен із методів з префіксом `set*` повертає референс на інстанс `OasOperationObject`, через що можна викликати декілька методів підряд:

```ts
@OasRoute('GET', ':slug', [], {
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

Як бачите, тут тричі викликаються методи з префіксом `set*` і в самому кінці - один раз з префіксом `get*`. Це важливий момент: "Кожне використання інстансу `OasOperationObject` повинно завершуватись викликом методу з префіксом `get*`".

Зверніть увагу, що тут `Params` та `ArticleItem` - це класи, що виступають тут у якості моделей даних, з яких хелпер `OasOperationObject` зчитує метадані. Для закріплення метаданих за кожною моделлю, використовується декоратор `@Column()`:

```ts
import { Column } from '@ditsmod/openapi';

export class ArticleItem {
  @Column()
  article: Article;
}
```




[1]: https://github.com/ditsmod/realworld/blob/main/packages/server/src/app/modules/service/validation/validation.extension.ts
[2]: https://github.com/ditsmod/realworld/blob/main/packages/server/src/app/modules/service/validation/validation.interceptor.ts
[3]: https://github.com/ditsmod/realworld/blob/main/packages/server/src/app/utils/oas-helpers.ts
