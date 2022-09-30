import { Injectable } from '@ts-stack/di';
import { ControllerErrorHandler, Req, Res, ErrorOpts, Status, Logger, isChainError } from '@ditsmod/core';
import { ErrorObject as OriginalErrorObject } from 'ajv';

import { AnyObj } from '@shared';

type ErrorObject = OriginalErrorObject & { instancePath?: string }; // Here fixed bug with ajv def

@Injectable()
export class ErrorHandler implements ControllerErrorHandler {
  constructor(private req: Req, private res: Res, private logger: Logger) {}

  async handleError(err: Error) {
    const req = this.req.toString();
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
    if (!this.res.nodeRes.headersSent) {
      this.addRequestIdToHeader();
      this.res.sendJson({ errors }, status);
    }
  }

  protected addRequestIdToHeader() {
    const header = 'x-requestId';
    this.res.nodeRes.setHeader(header, this.req.requestId);
  }
}
