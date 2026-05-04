import { HttpErrorHandler, restModule } from '@ditsmod/rest';
import { ErrorHandler } from './error-handler.js';

@restModule({
  providersPerReq: [{ token: HttpErrorHandler, useClass: ErrorHandler }],
  exports: [HttpErrorHandler],
})
export class ErrorHandlerModule {}
