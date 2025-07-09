import { inject, injectable, RawResponse, RAW_RES, Req, Res, RequestContext } from '@ditsmod/core';
import { HttpErrorHandler, ErrorInfo, Status, Logger, isChainError } from '@ditsmod/core';
import { ErrorObject as OriginalErrorObject } from 'ajv';

import { AnyObj } from '#shared';

type ErrorObject = OriginalErrorObject & { instancePath?: string }; // Here fixed bug with ajv def

@injectable()
export class ErrorHandler implements HttpErrorHandler {
  constructor(
    private req: Req,
    private res: Res,
    private logger: Logger,
    @inject(RAW_RES) private nodeRes: RawResponse
  ) {}

  async handleError(err: Error, ctx: RequestContext) {
    const req = this.req.toString();
    if (isChainError<ErrorInfo>(err)) {
      const { level, status, args1 } = err.info;
      this.logger.log(level || 'debug', { err, req });
      if (Array.isArray(args1)) {
        // Messages from ajv validator
        const errors = this.transformArrToObj(args1);
        ctx.rawRes.statusCode = status || Status.INTERNAL_SERVER_ERROR;
        this.sendError(errors);
      } else {
        let parameter = 'parameter';
        if (args1?.parameter) {
          parameter = args1.parameter;
        }
        ctx.rawRes.statusCode = status || Status.INTERNAL_SERVER_ERROR;
        this.sendError({ [parameter]: err.message });
      }
    } else {
      this.logger.log('error', { err, req });
      ctx.rawRes.statusCode = Status.INTERNAL_SERVER_ERROR;
      this.sendError({ handler: 'Internal server error' });
    }
  }

  protected transformArrToObj(arr: ErrorObject[]) {
    const errors: AnyObj = {};
    arr.forEach((err) => {
      errors[err.instancePath || 'parameter'] = err.message;
    });
    return errors;
  }

  protected sendError(errors: AnyObj) {
    if (!this.nodeRes.headersSent) {
      this.addRequestIdToHeader();
      this.res.sendJson({ errors });
    }
  }

  protected addRequestIdToHeader() {
    const header = 'x-requestId';
    this.nodeRes.setHeader(header, this.req.requestId);
  }
}
