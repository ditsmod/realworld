import { createHash } from 'crypto';
import { NodeRequest, Status } from '@ditsmod/core';
import { Injectable } from '@ts-stack/di';
import { Level } from '@ditsmod/logger';

import { ServerMsg } from '../msg/server-msg';
import { CustomError } from '../error-handler/custom-error';

@Injectable()
export class UtilService {
  constructor(private serverMsg: ServerMsg) {}

  getIp(nodeReq: NodeRequest) {
    return (nodeReq.headers['x-forwarded-for'] as string) || nodeReq.socket.remoteAddress;
  }

  getMd5(str: string) {
    return createHash('md5').update(str.toLocaleLowerCase()).digest('hex');
  }

  throw404Error(paramName: string, message?: string) {
    throw new CustomError({
      msg1: message || this.serverMsg.pageNotFound,
      args1: [paramName],
      status: Status.NOT_FOUND,
      level: Level.trace,
    });
  }

  throw401Error(paramName: string, message?: string) {
    throw new CustomError({
      msg1: message || this.serverMsg.authRequired,
      args1: [paramName],
      status: Status.UNAUTHORIZED,
      level: Level.trace,
    });
  }

  throw403Error(paramName: string, message?: string) {
    throw new CustomError({
      msg1: message || this.serverMsg.forbidden,
      args1: [paramName],
      status: Status.FORBIDDEN,
      level: Level.warn,
    });
  }
}
