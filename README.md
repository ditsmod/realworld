# ![RealWorld Example App](logo.png)

> ### Holu codebase containing real world examples (CRUD with @holu/typeorm, auth, i18n, OpenAPI with validation, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.


This codebase was created to demonstrate a fully fledged backend application built with **Holu** including CRUD operations with TypeORM (`@holu/typeorm`), authentication, routing, pagination, and more.

## Prerequisites

Please make sure that Node.js >= v24.0.0 is installed on your operating system.

## Getting started

This monorepository includes [Holu](https://holujs.github.io/en/) applications starter. Packages are in ESM format and have [native Node.js aliases](https://nodejs.org/api/packages.html#subpath-imports) starting with `#`.

All packages are located in `packages/*` directory.

From start you need:

1. Clone the project

```bash
git clone https://github.com/holujs/realworld.git my-app
cd my-app
```

2. Bootstrap the project

```bash
npm install
```

3. Copy `packages/server/.env-example` to `packages/server/.env`:

```bash
cp packages/server/.env-example packages/server/.env
```

And fill this file.

4. Then create database (for example `realworld`), grant access permissions for this database, and execute `MySQL`-dump from [packages/server/sql/dump/info.sql](./packages/server/sql/dump/info.sql).

## Start the web server

```bash
npm start
```

After that, see OpenAPI docs on [http://0.0.0.0:3000/api/openapi](http://0.0.0.0:3000/api/openapi).

## Tests

To run tests:

```bash
npm test
```
