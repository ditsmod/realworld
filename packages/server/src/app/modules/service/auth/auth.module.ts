import { Module } from '@ditsmod/core';
import { JwtModule } from '@ditsmod/jwt';

import { BearerGuard } from './bearer.guard';
import { ModuleConfigService } from './config.service';
import { CryptoService } from './crypto.service';

const jwtModuleWithParams = JwtModule.withParams({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '1y' } });

@Module({
  imports: [jwtModuleWithParams],
  providersPerMod: [ModuleConfigService],
  providersPerReq: [BearerGuard, CryptoService],
  exports: [BearerGuard, CryptoService]
})
export class AuthModule {}