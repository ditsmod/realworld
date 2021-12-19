import { ControllerErrorHandler, Module } from '@ditsmod/core';

import { ErrorHandler } from './error-handler';

@Module({
  providersPerReq: [{ provide: ControllerErrorHandler, useClass: ErrorHandler }],
  exports: [ControllerErrorHandler],
})
export class ErrorHandlerModule {}
