import { HttpErrorHandler, featureModule } from '@ditsmod/core';

import { ErrorHandler } from './error-handler.js';

@featureModule({
  providersPerReq: [{ token: HttpErrorHandler, useClass: ErrorHandler }],
  exports: [HttpErrorHandler],
})
export class ErrorHandlerModule {}
