---
slug: /
sidebar_position: 1
---

# Introduction

This site is intended for the repository [RealWorld][1], here is an explanation of the implementation of the [RealWorld specification][2] in the Ditsmod application.

To work with this application, you need to have Node.js and MySQL installed.

## Getting started

1. Clone the repository:

```bash
git clone https://github.com/ditsmod/realworld.git
```

2. Then install the dependencies and bootstrap the monorepository:

```bash
yarn install
yarn boot # This command actually call "lerna bootstrap"
```

3. Copy `packages/server/.env-example` into `packages/server/.env`:

```bash
cp packages/server/.env-example packages/server/.env
```

And fill this file.

4. Then create database (for example `real_world`), grant access permissions for this database, and execute `MySQL`-dump from [packages/server/sql/dump/info.sql][5].

## Start the web server in develop mode

```bash
yarn start
```

After that, see OpenAPI docs on [http://localhost:3000/api/openapi][3]

## Start the web server in production mode

```bash
yarn build
yarn start-prod
```

## Postman tests

To run [postman tests][4],
you need to go through steps described above and start the web server.

After that execute:

```bash
yarn postman-test
```

To rerun the tests, first you need clear MySQL tables:

```sql
delete from curr_articles where articleId > 0;
delete from curr_comments where commentId > 0;
delete from curr_users where userId > 0;
delete from dict_tags where tagId > 0;
delete from map_articles_tags where articleId > 0;
delete from map_favorites where articleId > 0;
delete from map_followers where userId > 0;
```

Truncate tables not the option because this tables have "Foreign Keys".


[1]: https://github.com/ditsmod/realworld
[2]: https://github.com/gothinkster/realworld
[3]: http://localhost:3000/api/openapi
[4]: https://github.com/gothinkster/realworld/blob/main/api/Conduit.postman_collection.json
[5]: https://github.com/ditsmod/realworld/blob/main/packages/server/sql/dump/info.sql
