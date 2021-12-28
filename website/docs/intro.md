---
slug: /
sidebar_position: 1
---

# Ознайомлення

Даний сайт призначений для репозиторія [realworld][1], тут викладено пояснення до імплементації [RealWorld][2] специфікації у Ditsmod-застосунку.

Щоб перевірити роботу даного застосунку, вам необхідно мати встановленими Node.js та MySQL.

## З чого почати

1. Клонуйте репозиторій одним із цих способів:

```bash
git clone git@github.com:ditsmod/realworld.git
# АБО
git clone https://github.com/ditsmod/realworld.git
```

2. Потім встановіть залежності та зберіть монорепозиторій:

```bash
yarn install
yarn boot # Насправді дана команда виконує "lerna bootstrap"
```

3. Скопіюйте `packages/server/.env-example` у `packages/server/.env`:

```bash
cp packages/server/.env-example packages/server/.env
```

Та заповніть усі змінні, указані в цьому файлі.

4. Потім виконайте скрипт, що являє собою `MySQL`-dump, із файла `packages/server/sql/dump/info.sql`.

## Запуск веб-сервера у режимі розробки

```bash
yarn start
```

Після цього, можете проглянути OpenAPI документацію на [http://localhost:3000/api/openapi][3]

## Запуск веб-сервера у продуктовому режимі

```bash
yarn build
yarn start-prod
```

## Postman тести

Щоб запустити [postman тести][4],
вам потрібно пройти усі 4 кроки, описані вище, та запустити веб-сервер.

Після цього можна запускати:

```bash
yarn postman-test
```

Повторий запуск даних тестів потребує очичення MySQL таблиць:

```sql
delete from curr_articles where articleId > 0;
delete from curr_comments where commentId > 0;
delete from curr_users where userId > 0;
delete from dict_tags where tagId > 0;
delete from map_articles_tags where articleId > 0;
delete from map_favorites where articleId > 0;
delete from map_followers where userId > 0;
```

Не для усіх таблиць можна робити `truncate`, бо деякі із них мають "Foreign Keys".


[1]: https://github.com/ditsmod/realworld
[2]: https://github.com/gothinkster/realworld
[3]: http://localhost:3000/api/openapi
[4]: https://github.com/gothinkster/realworld/blob/main/api/Conduit.postman_collection.json
