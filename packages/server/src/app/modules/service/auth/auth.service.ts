import { injectable, Injector } from '@ditsmod/core';
import { JWT_PAYLOAD } from '@ditsmod/jwt';

import { Permission } from '#shared';
import { BearerGuard } from './bearer.guard.js';

@injectable()
export class AuthService {
  constructor(private injector: Injector) {}

  /**
   * Returns userId or 0 (zero) if a user dose not have valid JWT.
   */
  async getCurrentUserId(): Promise<number> {
    const guard = this.injector.get(BearerGuard) as BearerGuard; // Lazy load auth.
    await guard.canActivate();
    const jwtPayload = this.injector.get(JWT_PAYLOAD);
    return jwtPayload?.userId || 0;
  }

  async hasPermissions(needPermissions?: Permission[]) {
    const userId = await this.getCurrentUserId();
    if (!userId) {
      return false;
    }
    const jwtPayload = this.injector.get(JWT_PAYLOAD);
    const userPermissions = jwtPayload?.permissions as Permission[];
    return Boolean(needPermissions?.every((permission) => userPermissions?.includes(permission)));
  }
}
