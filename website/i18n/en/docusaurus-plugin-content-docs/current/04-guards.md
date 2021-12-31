# Guards

The project has two guards:

- [BearerGuard][1] - to verify user authentication; it checks if the user has a valid Json Web Token;
- [PermissionsGuard][2] - to check the authorization of the user; it checks whether the user has the permissions to access a specific resource (this information is also extracted from the Json Web Token).


[1]: https://github.com/ditsmod/realworld/blob/main/packages/server/src/app/modules/service/auth/bearer.guard.ts
[2]: https://github.com/ditsmod/realworld/blob/main/packages/server/src/app/modules/service/auth/permissions.guard.ts
