# ![RealWorld Example App](logo.png)

> ### Ditsmod codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.


This codebase was created to demonstrate a fully fledged fullstack application built with **Ditsmod** including CRUD operations, authentication, routing, pagination, and more.

# Getting started

This monorepository includes [Ditsmod](https://ditsmod.github.io/en/) applications seed.

All packages are located in `packages/*` and are serviced by [lerna](https://github.com/lerna/lerna) and [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/).

From start you need:

1. Clone the project

```bash
git clone https://github.com/ditsmod/realworld.git my-app
cd my-app
```

2. Bootstrap the project

```bash
yarn install
yarn boot # This command actually call "lerna bootstrap"
```

3. Copy `packages/server/.env-example` to `packages/server/.env`:

```bash
cp packages/server/.env-example packages/server/.env
```

And fill this file.

4. Then create database (for example `real_world`), grant access permissions for this database, and execute `MySQL`-dump from [packages/server/sql/dump/info.sql](./packages/server/sql/dump/info.sql).

## Start the web server in develop mode

```bash
yarn start
```

After that, see OpenAPI docs on [http://localhost:3000/api/openapi](http://localhost:3000/api/openapi)

## Start the web server in production mode

```bash
yarn build
yarn start-prod
```

## Postman tests

To run [postman tests](https://github.com/gothinkster/realworld/blob/main/api/Conduit.postman_collection.json),
you need to go through the four steps described above and start the web server.

After that execute:

```bash
yarn postman-test
```

To rerun the tests, first you need clear MySQL tables:

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

## Extends the projects

Since this monorepo is served by yarn, it is necessary that any npm packages install via yarn.

If you want to add, for example, an Angular application, You can set yarn by default for angular-cli:

```bash
npm i -g add @angular/cli
ng config -g cli.packageManager yarn
```

Then you can do this:

```bash
cd packages
ng new my-angular-application --routing
```

For some reason, a bug of yarn appears after this command. If you open [http://localhost:3000/api/openapi](http://localhost:3000/api/openapi) you will see this bug. To avoid it, it is necessary delete `yarn.lock` and rebootstrap the monorepo:

```bash
yarn boot
```

Then open `packages/<your-project-name>/angular.json` and fix `$schema`:

```json
// ...
"$schema": "../../node_modules/@angular/cli/lib/config/schema.json",
// ...
```

## See also

- [Documentation in Ukrainian](https://ditsmod.github.io/realworld/)