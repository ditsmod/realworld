# ![RealWorld Example App](logo.png)

> ### Ditsmod codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.


This codebase was created to demonstrate a fully fledged fullstack application built with **Ditsmod** including CRUD operations, authentication, routing, pagination, and more.

# Getting started

This monorepository includes [Ditsmod](https://ditsmod.github.io/en/) applications seed. Packages are in ESM format and have [native Node.js aliases](https://nodejs.org/api/packages.html#subpath-imports) starting with `#`.

All packages are located in `packages/*` directory.

From start you need:

1. Clone the project

```bash
git clone https://github.com/ditsmod/realworld.git my-app
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

4. Then create database (for example `real_world`), grant access permissions for this database, and execute `MySQL`-dump from [packages/server/sql/dump/info.sql](./packages/server/sql/dump/info.sql).

## Start the web server

```bash
npm start
```

After that, see OpenAPI docs on [http://localhost:3000/api/openapi](http://localhost:3000/api/openapi)

## Postman tests

To run [postman tests](https://github.com/gothinkster/realworld/blob/main/api/Conduit.postman_collection.json):

```bash
npm test
```
