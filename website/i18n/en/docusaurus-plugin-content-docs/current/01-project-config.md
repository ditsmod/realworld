---
sidebar_position: 2
---

# Project settings

## Directory structure

In `packages/server` Ditsmod-application has the following directory structure:

```text
src
└── app
    ├── models
    ├── modules
    │   ├── routed
    │   │   ├── articles
    │   │   │   ├── comments
    │   │   │   └── favorite
    │   │   ├── profiles
    │   │   ├── tags
    │   │   └── users
    │   └── service
    │       ├── app-config
    │       ├── auth
    │       ├── error-handler
    │       ├── logger
    │       ├── msg
    │       ├── mysql
    │       ├── openapi-with-params
    │       ├── util
    │       └── validation
    └── utils
```

The main feature here is that the modules are divided into two conditional types:

1. `routed` - here are the modules that have controllers. Typically, such modules are imported with certain prefixes. For example, the `articles` module is imported with the prefix `articles` and has one controller.
2. `service` - here are modules that do not have controllers, but have exported services and extensions.

The `models` directory contains only those models that do not belong to certain modules. Similar to the `utils` directory.

## Aliases for imports

Aliases are widely used in the project to import local files. For example, instead of importing:

```ts
import { AppConfigService } from '../../service/app-config/config.service';
```

the following is used:

```ts
import { AppConfigService } from '@service/app-config/config.service';
```

Here `@service/*` is an alias that points to modules located in `src/app/modules/service/*`. The alias data sets by `compilerOptions.paths` in two files:

- `./packages/server/tsconfig.json`;
- `./tsconfig.json`.

When you run a Ditsmod application in development mode:

```bash
npm start
```

the file `./packages/server/tsconfig.json` is used, in which aliases point to the directory `src`:

```json
{
  // ...
  "compilerOptions": {
    // ...
    "paths": {
      "@classes/*": ["./src/app/classes/*"],
      "@service/*": ["./src/app/modules/service/*"],
      "@routed/*": ["./src/app/modules/routed/*"],
      "@services-per-app/*": ["./src/app/services-per-app/*"],
      "@models/*": ["./src/app/models/*"],
      "@utils/*": ["./src/app/utils/*"],
      "@shared": ["../shared/src"],
      "@shared/*": ["../shared/src/*"],
    }
  },
  // ...
}
```

When you run the Ditsmod application in product mode:

```bash
npm run build
npm start-prod
```

the file `./tsconfig.json` is used, in which aliases point to the compiled files in the `dist` directory:

```json
{
  // ...
  "compilerOptions": {
    // ...
    "paths": {
      "@classes/*": ["./packages/server/dist/app/classes/*"],
      "@service/*": ["./packages/server/dist/app/modules/service/*"],
      "@routed/*": ["./packages/server/dist/app/modules/routed/*"],
      "@services-per-app/*": ["./packages/server/dist/app/services-per-app/*"],
      "@models/*": ["./packages/server/dist/app/models/*"],
      "@utils/*": ["./packages/server/dist/app/utils/*"],
      "@shared": ["./packages/shared/dist/server"],
      "@shared/*": ["./packages/shared/dist/server/*"],
    }
  },
  // ...
}
```

The [tsconfig-paths][1] utility is used for both the development mode and the product mode.


In addition, aliases are also listed in `packages/server/jest.config.ts` so that when testing, `jest` to know where to look for files.


[1]: https://github.com/dividab/tsconfig-paths
