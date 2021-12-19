import { Module } from '@ditsmod/core';
import { JwtModule } from '@ditsmod/jwt';

import { BasicGuard } from './basic.guard';
import { BearerGuard } from './bearer.guard';
import { ModuleConfigService } from './config.service';
import { CryptoService } from './crypto.service';

const jwtModuleWithParams = JwtModule.withParams({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '10m' } });

@Module({
  imports: [jwtModuleWithParams],
  providersPerMod: [ModuleConfigService],
  providersPerReq: [BearerGuard, BasicGuard, CryptoService],
  exports: [BearerGuard, BasicGuard, CryptoService]
})
export class AuthModule {}