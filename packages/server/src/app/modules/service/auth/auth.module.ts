import { Module } from '@ditsmod/core';
import { JwtModule } from '@ditsmod/jwt';

import { AuthService } from './auth.service';
import { BearerGuard } from './bearer.guard';
import { ModuleConfigService } from './config.service';
import { CryptoService } from './crypto.service';
import { PermissionsGuard } from './permissions.guard';

const jwtModuleWithParams = JwtModule.withParams({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '1y' } });

@Module({
  imports: [jwtModuleWithParams],
  providersPerMod: [ModuleConfigService],
  providersPerReq: [BearerGuard, CryptoService, AuthService, PermissionsGuard],
  exports: [BearerGuard, CryptoService, AuthService, PermissionsGuard]
})
export class AuthModule {}