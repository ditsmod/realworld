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

  throw404Error() {
    throw new CustomError({ msg1: this.serverMsg.pageNotFound, status: Status.NOT_FOUND, level: Level.trace });
  }

  throw403Error() {
    throw new CustomError({ msg1: this.serverMsg.forbidden, status: Status.FORBIDDEN, level: Level.warn });
  }
}
