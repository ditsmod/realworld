import { restModule } from '@ditsmod/rest';
import { JwtModule } from '@ditsmod/jwt';
import { AuthjsConfig, AuthjsModule } from '@ditsmod/authjs';

import { AuthService } from './auth.service.js';
import { BearerGuard } from './bearer.guard.js';
import { ModuleConfigService } from './config.service.js';
import { CryptoService } from './crypto.service.js';
import { PermissionsGuard } from './permissions.guard.js';
import { OverriddenAuthConfig } from './authjs.config.js';

const jwtModuleWithOpts = JwtModule.withOpts({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '1y' } });
const authjs = AuthjsModule.withConfig({
  token: AuthjsConfig,
  useFactory: [OverriddenAuthConfig, OverriddenAuthConfig.prototype.initAuthjsConfig],
});

@restModule({
  imports: [jwtModuleWithOpts, authjs],
  providersPerMod: [ModuleConfigService],
  providersPerReq: [BearerGuard, CryptoService, AuthService, PermissionsGuard],
  exports: [BearerGuard, CryptoService, AuthService, PermissionsGuard, jwtModuleWithOpts, authjs],
})
export class AuthModule {}
