# Гарди

У проекті є два гарди:

- [BearerGuard][1] - для перевірки автентифікації у користувача; він перевіряє чи має користувач валідний Json Web Token;
- [PermissionsGuard][2] - для перевірки авторизації у користувача; він перевіряє чи користувач має право доступу до конкретного ресурсу (ця інформація теж витягається із Json Web Token).


[1]: https://github.com/ditsmod/realworld/blob/main/packages/server/src/app/modules/service/auth/bearer.guard.ts
[2]: https://github.com/ditsmod/realworld/blob/main/packages/server/src/app/modules/service/auth/permissions.guard.ts
