import { CanActivate, Req, Status } from '@ditsmod/core';
import { JwtService, VerifyErrors } from '@ditsmod/jwt';
import { OasGuard } from '@ditsmod/openapi';

/**
 * If user successfully passed this guard, you can use `this.req.jwtPayload`.
 */
@OasGuard({
  securitySchemeObject: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description:
      'See docs for [Bearer Authentication](https://swagger.io/docs/specification/authentication/bearer-authentication/)',
  },
  responses: {
    [Status.UNAUTHORIZED]: {
      $ref: '#/components/responses/UnauthorizedError',
    },
  },
})
export class BearerGuard implements CanActivate {
  constructor(private req: Req, private jwtService: JwtService) {}

  async canActivate() {
    const authValue = this.req.nodeReq.headers.authorization?.split(' ');
    if (authValue?.[0] != 'Token') {
      return false;
    }

    const token = authValue[1];
    const payload = await this.jwtService
      .verifyWithSecret(token)
      .then((payload) => payload)
      .catch((err: VerifyErrors) => false as const); // Here `as const` to narrow down returned type.

    if (payload) {
      this.req.jwtPayload = payload;
      return true;
    } else {
      return false;
    }
  }
}
