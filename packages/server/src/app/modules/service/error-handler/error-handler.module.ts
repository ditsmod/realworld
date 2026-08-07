import { HttpErrorHandler, restModule } from '@holu/rest';
import { ErrorHandler } from './error-handler.js';

@restModule({
  providersPerReq: [{ token: HttpErrorHandler, useClass: ErrorHandler }],
  exports: [HttpErrorHandler],
})
export class ErrorHandlerModule {}
