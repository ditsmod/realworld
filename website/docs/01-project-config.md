---
sidebar_position: 2
---

# Налаштування проекту

## Структура директорій

У `packages/server` Ditsmod-застосунок має наступну структуру директорій:

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

Сама головна особливість тут у тому, що модулі поділені на два умовні типи:

1. `routed` - тут знаходяться модулі, що мають контролери. Як правило, такі модулі імпортуються з певними префіксами. Наприклад, модуль `articles` імпортується з префіксом `articles` та має один контролер.
2. `service` - тут знаходяться модулі, що не мають контролерів, але мають експортовані сервіси та розширення.

Директорія `models` містить лише ті моделі, що не відносяться до певних модулів. Аналогічно із директорією `utils`.

## Аліаси для імпортів

У проекті широко використовуються аліаси для імпортів локальних файлів. Наприклад, замість такого імпорту:

```ts
import { AppConfigService } from '../../service/app-config/config.service';
```

використовується такий:

```ts
import { AppConfigService } from '@service/app-config/config.service';
```

Тут `@service/*` - це аліас, що вказує на модулі, розташовані у `src/app/modules/service/*`. Робота даних аліасів забезпечується налаштуванням `compilerOptions.paths` у двох файлах:

- `./packages/server/tsconfig.json`;
- `./tsconfig.json`.

Коли ви запускаєте Ditsmod-застосунок у режимі розробки:

```bash
npm start
```

використовується файл `./packages/server/tsconfig.json`, у ньому аліаси вказують на директорію `src`:

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

Коли ви запускаєте Ditsmod-застосунок у продуктовому режимі:

```bash
npm run build
npm start-prod
```

використовується файл `./tsconfig.json`, у ньому аліаси вказують на скомпільовані файли в директорії `dist`:

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

І для режиму розробки, і для продуктового режиму використовується утиліта [tsconfig-paths][1].


Окрім цього, аліаси прописані також у `packages/server/jest.config.ts` щоб при тестуванні `jest` знав де шукати файли.


[1]: https://github.com/dividab/tsconfig-paths
