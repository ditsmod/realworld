import { injectable, HttpStatus, Logger, ctx } from '@ditsmod/core';
import { ErrorInfo, isChainError } from '@ditsmod/core/errors';
import { HttpErrorHandler, RawResponse, RAW_RES, RequestContext } from '@ditsmod/rest';
import { ErrorObject as OriginalErrorObject } from 'ajv';

import { AnyObj } from '#shared';

type ErrorObject = OriginalErrorObject & { instancePath?: string }; // Here fixed bug with ajv def

@injectable()
export class ErrorHandler implements HttpErrorHandler {
  constructor(private logger: Logger, @ctx(RAW_RES) private nodeRes: RawResponse) {}

  async handleError(err: Error, ctx: RequestContext) {
    const req = ctx.toString();
    if (isChainError<ErrorInfo>(err)) {
      const { level, status, args1 } = err.info;
      this.logger.log(level || 'debug', { err, req });
      if (Array.isArray(args1)) {
        // Messages from ajv validator
        const errors = this.transformArrToObj(args1);
        ctx.rawRes.statusCode = status || HttpStatus.INTERNAL_SERVER_ERROR;
        this.sendError(ctx, errors);
      } else {
        let parameter = 'parameter';
        if (args1?.parameter) {
          parameter = args1.parameter;
        }
        ctx.rawRes.statusCode = status || HttpStatus.INTERNAL_SERVER_ERROR;
        this.sendError(ctx, { [parameter]: err.message });
      }
    } else {
      this.logger.log('error', { err, req });
      ctx.rawRes.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      this.sendError(ctx, { handler: 'Internal server error' });
    }
  }

  protected transformArrToObj(arr: ErrorObject[]) {
    const errors: AnyObj = {};
    arr.forEach((err) => {
      errors[err.instancePath || 'parameter'] = err.message;
    });
    return errors;
  }

  protected sendError(ctx: RequestContext, errors: AnyObj) {
    if (!this.nodeRes.headersSent) {
      this.addRequestIdToHeader(ctx);
      ctx.sendJson({ errors });
    }
  }

  protected addRequestIdToHeader(ctx: RequestContext) {
    const header = 'x-requestId';
    this.nodeRes.setHeader(header, ctx.requestId);
  }
}
