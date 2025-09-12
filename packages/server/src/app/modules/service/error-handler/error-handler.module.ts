import { HttpErrorHandler, initRest } from '@ditsmod/rest';
import { featureModule } from '@ditsmod/core';

import { ErrorHandler } from './error-handler.js';

@initRest({
  providersPerReq: [{ token: HttpErrorHandler, useClass: ErrorHandler }],
  exports: [HttpErrorHandler],
})
@featureModule()
export class ErrorHandlerModule {}
