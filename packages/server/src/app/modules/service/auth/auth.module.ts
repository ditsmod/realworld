import { Module } from '@ditsmod/core';
import { JwtModule } from '@ditsmod/jwt';

import { BearerGuard } from './bearer.guard';

const jwtModuleWithParams = JwtModule.withParams({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '10m' } });

@Module({
  imports: [jwtModuleWithParams],
  providersPerReq: [BearerGuard],
  exports: [BearerGuard]
})
export class AuthModule {}