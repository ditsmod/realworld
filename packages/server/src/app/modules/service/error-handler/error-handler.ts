import { format } from 'util';
import { Injectable } from '@ts-stack/di';
import { Logger, LoggerMethod, Status, Req, Res, ControllerErrorHandler, getStatusText } from '@ditsmod/core';
import { ChainError } from '@ts-stack/chain-error';
import { Level, LevelNames } from '@ditsmod/logger';

import { ApiResponse } from '@shared';
import { ErrorOpts } from './custom-error';

@Injectable()
export class ErrorHandler implements ControllerErrorHandler {
  constructor(
    private req: Req,
    private res: Res<ApiResponse<any>>,
    private log: Logger
  ) {}

  async handleError(err: ChainError<ErrorOpts> | Error) {
    const req = this.req;
    let message = err.message;
    if (err instanceof ChainError) {
      const template = err.info.msg1 || '';
      if (template.includes('%s')){
        message = format(template, ...(err.info.args1 || []));
      } else {
        message = format(template);
      }
      err.message = message;
      const { level, status } = err.info;
      const levelName = Level[level!] as LevelNames;
      delete err.info.level;
      (this.log[levelName] as LoggerMethod)({ err, req, ...err.info });
      if (!this.res.nodeRes.headersSent) {
        this.res.sendJson({ error: { message } }, status);
      }
    } else {
      this.log.error({ err, req });
      if (!this.res.nodeRes.headersSent) {
        this.res.sendJson({ error: { message: 'Internal server error' } }, Status.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
