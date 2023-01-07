import { RequestContext } from '@ditsmod/core';
import { injectable, Injector } from '@ditsmod/core';

import { Permission } from '@shared';
import { BearerGuard } from './bearer.guard';

@injectable()
export class AuthService {
  constructor(private injector: Injector, private ctx: RequestContext) {}

  /**
   * Returns userId or 0 (zero) if a user dose not have valid JWT.
   */
  async getCurrentUserId(): Promise<number> {
    const guard = this.injector.get(BearerGuard) as BearerGuard; // Lazy load auth.
    await guard.canActivate();
    return this.ctx.req.jwtPayload?.userId || 0;
  }

  async hasPermissions(needPermissions?: Permission[]) {
    const userId = await this.getCurrentUserId();
    if (!userId) {
      return false;
    }
    const userPermissions = this.ctx.req.jwtPayload?.permissions as Permission[];
    return Boolean(needPermissions?.every((permission) => userPermissions?.includes(permission)));
  }
}
