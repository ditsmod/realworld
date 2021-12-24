## About the project

This monorepository includes [Ditsmod](https://ditsmod.github.io/en/docs/intro) applications seed.

All packages are located in `packages/*` and are serviced by [lerna](https://github.com/lerna/lerna) and [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/).

From start you need to do:

```bash
yarn install
yarn boot # This command actually call "lerna bootstrap"
```

After that, copy `packages/server/.env-example` to `packages/server/.env`:

```bash
cp packages/server/.env-example packages/server/.env-test
```

And fill this file.

If you want to add, for example, an Angular application, you can do this:

```bash
npm install -g @angular/cli
ng new packages/my-angular-application
```

## Start the web server in develop mode

```bash
yarn start
```

After this, see OpenAPI docs on [http://localhost:3000/api/openapi](http://localhost:3000/api/openapi)

## Start the web server in production mode

```bash
yarn build
yarn start-prod
```
