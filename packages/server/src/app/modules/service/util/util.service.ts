import { createHash } from 'crypto';
import { NodeRequest, Status, CustomError } from '@ditsmod/core';
import { Injectable } from '@ts-stack/di';

import { ServerDict } from '../i18n/server.dict';

@Injectable()
export class UtilService {
  constructor(private serverMsg: ServerDict) {}

  getIp(nodeReq: NodeRequest) {
    return (nodeReq.headers['x-forwarded-for'] as string) || nodeReq.socket.remoteAddress;
  }

  getMd5(str: string) {
    return createHash('md5').update(str.toLocaleLowerCase()).digest('hex');
  }

  throw404Error(paramName: string, message?: string) {
    throw new CustomError({
      msg1: message || this.serverMsg.pageNotFound,
      // args1: [paramName],
      status: Status.NOT_FOUND,
      level: 'trace',
    });
  }

  throw401Error(paramName: string, message?: string) {
    throw new CustomError({
      msg1: message || this.serverMsg.authRequired,
      // args1: [paramName],
      status: Status.UNAUTHORIZED,
      level: 'trace',
    });
  }

  throw403Error(paramName: string, message?: string) {
    throw new CustomError({
      msg1: message || this.serverMsg.forbidden,
      // args1: [paramName],
      status: Status.FORBIDDEN,
      level: 'warn',
    });
  }
}
