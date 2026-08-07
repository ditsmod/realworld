import { injectable, HttpStatus } from '@holu/core';
import { RequestContext, CanActivate } from '@holu/rest';

import { Permission } from '#shared';
import { AuthService } from './auth.service.js';

@injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(ctx: RequestContext, params?: Permission[]) {
    if (await this.authService.hasPermissions(params)) {
      return true;
    } else {
      return new Response(null, { status: HttpStatus.FORBIDDEN });
    }
  }
}
