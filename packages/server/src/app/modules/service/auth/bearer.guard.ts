import { CanActivate, inject, Injector, NodeRequest, NODE_REQ, Status } from '@ditsmod/core';
import { JwtService, JWT_PAYLOAD, VerifyErrors } from '@ditsmod/jwt';
import { oasGuard } from '@ditsmod/openapi';

/**
 * If user successfully passed this guard, you can use `this.req.jwtPayload`.
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
    [Status.UNAUTHORIZED]: {
      $ref: '#/components/responses/UnauthorizedError',
    },
  },
})
export class BearerGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @inject(NODE_REQ) private nodeReq: NodeRequest,
    private injector: Injector,
  ) {}

  async canActivate() {
    const authValue = this.nodeReq.headers.authorization?.split(' ');
    if (authValue?.[0] != 'Bearer' && authValue?.[0] != 'Token') {
      return false;
    }

    const token = authValue[1];
    const payload = await this.jwtService
      .verifyWithSecret(token)
      .then((payload) => payload)
      .catch((err: VerifyErrors) => false as const); // Here `as const` to narrow down returned type.

    if (payload) {
      this.injector.setByToken(JWT_PAYLOAD, payload);
      return true;
    } else {
      return false;
    }
  }
}
