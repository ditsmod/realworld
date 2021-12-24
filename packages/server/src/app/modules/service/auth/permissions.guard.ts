import { Injectable } from '@ts-stack/di';
import { CanActivate, Status } from '@ditsmod/core';

import { Permission } from '@shared';
import { AuthService } from './auth.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(params?: Permission[]) {
    if (await this.authService.hasPermissions(params)) {
      return true;
    } else {
      return Status.FORBIDDEN;
    }
  }
}
