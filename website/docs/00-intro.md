---
slug: /
sidebar_position: 1
---

# Ознайомлення

Даний сайт призначений для репозиторія [RealWorld][1], тут викладено пояснення до імплементації [RealWorld специфікації][2] у Ditsmod-застосунку.

Щоб перевірити роботу даного застосунку, вам необхідно мати встановленими Node.js та MySQL.

## З чого почати

1. Клонуйте репозиторій:

```bash
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

4. Створіть базу даних (наприклад `real_world`) в MySQL, надайте права для неї, а потім виконайте скрипт, що являє собою `MySQL`-dump, із файла [packages/server/sql/dump/info.sql][5].

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

Повторний запуск даних тестів потребує очищення MySQL таблиць:

```sql
SET FOREIGN_KEY_CHECKS=0;
truncate curr_articles;
truncate curr_comments;
truncate curr_users;
truncate dict_tags;
truncate map_articles_tags;
truncate map_favorites;
truncate map_followers;
SET FOREIGN_KEY_CHECKS=1;
```


[1]: https://github.com/ditsmod/realworld
[2]: https://github.com/gothinkster/realworld
[3]: http://localhost:3000/api/openapi
[4]: https://github.com/gothinkster/realworld/blob/main/api/Conduit.postman_collection.json
[5]: https://github.com/ditsmod/realworld/blob/main/packages/server/sql/dump/info.sql
