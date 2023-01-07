import { injectable, RequestContext } from '@ditsmod/core';
import { ControllerErrorHandler, ErrorOpts, Status, Logger, isChainError } from '@ditsmod/core';
import { ErrorObject as OriginalErrorObject } from 'ajv';

import { AnyObj } from '@shared';

type ErrorObject = OriginalErrorObject & { instancePath?: string }; // Here fixed bug with ajv def

@injectable()
export class ErrorHandler implements ControllerErrorHandler {
  constructor(private ctx: RequestContext, private logger: Logger) {}

  async handleError(err: Error) {
    const req = this.ctx.req.toString();
    if (isChainError<ErrorOpts>(err)) {
      const { level, status, args1 } = err.info;
      this.logger.log(level || 'debug', { err, req });
      if (Array.isArray(args1)) {
        // Messages from ajv validator
        const errors = this.transformArrToObj(args1);
        this.sendError(errors, status);
      } else {
        let parameter = 'parameter';
        if (args1?.parameter) {
          parameter = args1.parameter;
        }
        this.sendError({ [parameter]: err.message }, status);
      }
    } else {
      this.logger.error({ err, req });
      this.sendError({ handler: 'Internal server error' }, Status.INTERNAL_SERVER_ERROR);
    }
  }

  protected transformArrToObj(arr: ErrorObject[]) {
    const errors: AnyObj = {};
    arr.forEach((err) => {
      errors[err.instancePath || 'parameter'] = err.message;
    });
    return errors;
  }

  protected sendError(errors: AnyObj, status?: Status) {
    if (!this.ctx.nodeRes.headersSent) {
      this.addRequestIdToHeader();
      this.ctx.res.sendJson({ errors }, status);
    }
  }

  protected addRequestIdToHeader() {
    const header = 'x-requestId';
    this.ctx.nodeRes.setHeader(header, this.ctx.req.requestId);
  }
}
