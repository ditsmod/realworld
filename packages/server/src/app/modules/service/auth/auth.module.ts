import { featureModule } from '@ditsmod/core';
import { JwtModule } from '@ditsmod/jwt';

import { AuthService } from './auth.service.js';
import { BearerGuard } from './bearer.guard.js';
import { ModuleConfigService } from './config.service.js';
import { CryptoService } from './crypto.service.js';
import { PermissionsGuard } from './permissions.guard.js';

const jwtModuleWithParams = JwtModule.withParams({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '1y' } });

@featureModule({
  imports: [jwtModuleWithParams],
  providersPerMod: [ModuleConfigService],
  providersPerReq: [BearerGuard, CryptoService, AuthService, PermissionsGuard],
  exports: [BearerGuard, CryptoService, AuthService, PermissionsGuard, jwtModuleWithParams],
})
export class AuthModule {}
