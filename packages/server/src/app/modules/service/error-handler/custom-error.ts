import { ChainError } from '@ts-stack/chain-error';
import { Level } from '@ditsmod/logger';
import { Status } from '@ditsmod/core';

export class ErrorOpts {
  /**
   * Message for fronend.
   */
  msg1?: string = '';
  /**
   * Arguments for `msg1`.
   */
  args1?: any[];
  /**
   * Message for a logger.
   */
  msg2?: string = '';
  /**
   * Arguments for `msg2`.
   */
  args2?: any[];
  /**
   * Log level.
   */
  level?: Level = Level.debug;
  /**
   * HTTP response status.
   */
  status?: Status = Status.BAD_REQUEST;
  /**
   * HTTP client input params.
   */
  params?: any;

  constructor(info = {} as ErrorOpts) {
    let key: keyof ErrorOpts;
    for (key in info) {
      if (info[key] !== undefined) {
        this[key] = info[key];
      }
    }
  }
}

export class CustomError extends ChainError {
  constructor(info: ErrorOpts, cause?: Error) {
    // Merge with default options
    info = new ErrorOpts(info);

    super(`${info.msg1}`, { info, cause }, true);
  }
}
