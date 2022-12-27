import { ControllerErrorHandler, featureModule } from '@ditsmod/core';

import { ErrorHandler } from './error-handler';

@featureModule({
  providersPerReq: [{ token: ControllerErrorHandler, useClass: ErrorHandler }],
  exports: [ControllerErrorHandler],
})
export class ErrorHandlerModule {}
