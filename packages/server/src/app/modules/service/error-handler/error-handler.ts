import { format } from 'util';
import { Injectable } from '@ts-stack/di';
import { Logger, Status, Req, Res, ControllerErrorHandler } from '@ditsmod/core';
import { ChainError } from '@ts-stack/chain-error';
import { Level, LevelNames } from '@ditsmod/logger';

import { ErrorOpts } from './custom-error';

@Injectable()
export class ErrorHandler implements ControllerErrorHandler {
  constructor(
    private req: Req,
    private res: Res,
    private log: Logger
  ) {}

  async handleError(err: ChainError<ErrorOpts> | Error) {
    const req = this.req;
    let message = err.message;
    if (err instanceof ChainError) {
      const template = err.info.msg1!;
      const paramName = err.info.args1![0];
      const restArgs1 = err.info.args1!.slice(1);
      if (template.includes('%s')){
        message = format(template, ...restArgs1);
      } else {
        message = format(template);
      }
      err.message = paramName ? `Parameter '${paramName}': ${message}` : message;
      const { level, status } = err.info;
      const levelName = Level[level!] as LevelNames;
      delete err.info.level;
      this.log[levelName]({ err, req, ...err.info });
      if (!this.res.nodeRes.headersSent) {
        this.res.sendJson({ errors: { [paramName]: [message] } }, status);
      }
    } else {
      this.log.error({ err, req });
      if (!this.res.nodeRes.headersSent) {
        this.res.sendJson({ error: { message: 'Internal server error' } }, Status.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
