import { restModule } from '@holu/rest';
import { JwtModule } from '@holu/jwt';

import { AuthService } from './auth.service.js';
import { BearerGuard } from './bearer.guard.js';
import { ModuleConfigService } from './config.service.js';
import { CryptoService } from './crypto.service.js';
import { PermissionsGuard } from './permissions.guard.js';

const jwtModuleWithOpts = JwtModule.withOpts({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '1y' } });

@restModule({
  imports: [jwtModuleWithOpts],
  providersPerMod: [ModuleConfigService],
  providersPerReq: [BearerGuard, CryptoService, AuthService, PermissionsGuard],
  exports: [BearerGuard, CryptoService, AuthService, PermissionsGuard, jwtModuleWithOpts],
})
export class AuthModule {}
