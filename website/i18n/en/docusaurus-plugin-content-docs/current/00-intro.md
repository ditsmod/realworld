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
npm run install
```

3. Copy `packages/server/.env-example` into `packages/server/.env`:

```bash
cp packages/server/.env-example packages/server/.env
```

And fill this file.

4. Then create database (for example `real_world`), grant access permissions for this database, and execute `MySQL`-dump from [packages/server/sql/dump/info.sql][5].

## Start the web server in develop mode

```bash
npm start
```

After that, see OpenAPI docs on [http://localhost:3000/api/openapi][3]

## Start the web server in production mode

```bash
npm run build
npm start-prod
```

## Postman tests

To run [postman tests][4]:

```bash
npm test
```


[1]: https://github.com/ditsmod/realworld
[2]: https://github.com/gothinkster/realworld
[3]: http://localhost:3000/api/openapi
[4]: https://github.com/gothinkster/realworld/blob/main/api/Conduit.postman_collection.json
[5]: https://github.com/ditsmod/realworld/blob/main/packages/server/sql/dump/info.sql
