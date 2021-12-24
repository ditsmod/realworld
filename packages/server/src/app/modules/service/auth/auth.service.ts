import { Req } from '@ditsmod/core';
import { Injectable, Injector } from '@ts-stack/di';

import { Permission } from '@shared';
import { BearerGuard } from './bearer.guard';

@Injectable()
export class AuthService {
  constructor(private injector: Injector, private req: Req) {}

  /**
   * Returns userId or 0 (zero) if a user dose not have valid JWT.
   */
  async getCurrentUserId(): Promise<number> {
    const guard = this.injector.get(BearerGuard) as BearerGuard; // Lazy load auth.
    await guard.canActivate();
    return this.req.jwtPayload?.userId || 0;
  }

  async hasPermissions(needPermissions?: Permission[]) {
    const userId = await this.getCurrentUserId();
    if (!userId) {
      return false;
    }
    const userPermissions = this.req.jwtPayload?.permissions as Permission[];
    return Boolean(needPermissions?.every((permission) => userPermissions?.includes(permission)));
  }
}
