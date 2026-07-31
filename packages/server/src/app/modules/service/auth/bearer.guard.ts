import { HttpStatus, Context } from '@ditsmod/core';
import { JwtService, JWT_PAYLOAD, VerifyErrors } from '@ditsmod/jwt';
import { oasGuard } from '@ditsmod/openapi';
import { CanActivate, RAW_REQ, RawRequest } from '@ditsmod/rest';

export interface JwtAuthPayload {
  userId: number;
}

/**
 * If a user successfully passes this guard, you can inject their token payload in controllers using `@ctx(JWT_PAYLOAD) jwtPayload: JwtAuthPayload`.
 */
@oasGuard({
  securitySchemeObject: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description:
      'See docs for [Bearer Authentication](https://swagger.io/docs/specification/authentication/bearer-authentication/)',
  },
  responses: {
    [HttpStatus.UNAUTHORIZED]: {
      $ref: '#/components/responses/UnauthorizedError',
    },
  },
})
export class BearerGuard implements CanActivate {
  constructor(private jwtService: JwtService, private ctx: Context) {}

  async canActivate() {
    const nodeReq = this.ctx.get(RAW_REQ) as RawRequest;
    const authValue = nodeReq.headers.authorization?.split(' ');
    if (authValue?.[0] != 'Bearer' && authValue?.[0] != 'Token') {
      return false;
    }

    const token = authValue[1];
    const payload = await this.jwtService
      .verifyWithSecret(token)
      .then((payload) => payload)
      .catch((err: VerifyErrors) => false as const); // Here `as const` to narrow down returned type.

    if (payload) {
      this.ctx.set(JWT_PAYLOAD, payload);
      return true;
    } else {
      return false;
    }
  }
}
