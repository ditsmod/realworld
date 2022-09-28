import { createHash } from 'crypto';
import { NodeRequest, Status, CustomError } from '@ditsmod/core';
import { Injectable } from '@ts-stack/di';
import { DictService } from '@ditsmod/i18n';

import { ServerDict } from '../openapi-with-params/locales/current/_base-en/server.dict';

@Injectable()
export class UtilService {
  constructor(private dictService: DictService) {}

  getIp(nodeReq: NodeRequest) {
    return (nodeReq.headers['x-forwarded-for'] as string) || nodeReq.socket.remoteAddress;
  }

  getMd5(str: string) {
    return createHash('md5').update(str.toLocaleLowerCase()).digest('hex');
  }

  convertToBool(value: boolean | string | number): boolean {
    return !value || value == 'false' || value == '0' ? false : true;
  }

  throw404Error(paramName: string, message?: string) {
    const dict = this.dictService.getDictionary(ServerDict);
    throw new CustomError({
      msg1: message || dict.pageNotFound(paramName),
      // args1: [paramName],
      status: Status.NOT_FOUND,
      level: 'trace',
    });
  }

  throw401Error(paramName: string, message?: string) {
    const dict = this.dictService.getDictionary(ServerDict);
    throw new CustomError({
      msg1: message || dict.authRequired(paramName),
      status: Status.UNAUTHORIZED,
      level: 'trace',
    });
  }

  throw403Error(paramName: string, message?: string) {
    const dict = this.dictService.getDictionary(ServerDict);
    throw new CustomError({
      msg1: message || dict.forbidden(paramName),
      status: Status.FORBIDDEN,
      level: 'warn',
    });
  }
}
