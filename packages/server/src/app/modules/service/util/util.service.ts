import { createHash } from 'crypto';
import { HttpStatus, injectable } from '@ditsmod/core';
import { CustomError } from '@ditsmod/core/errors';
import { DictService } from '@ditsmod/i18n';
import { RawRequest } from '@ditsmod/rest';

import { ServerDict } from '../openapi-with-params/locales/current/_base-en/server.dict.js';

@injectable()
export class UtilService {
  constructor(private dictService: DictService) {}

  getIp(nodeReq: RawRequest) {
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
      status: HttpStatus.NOT_FOUND,
      level: 'trace',
    });
  }

  throw401Error(paramName: string, message?: string) {
    const dict = this.dictService.getDictionary(ServerDict);
    throw new CustomError({
      msg1: message || dict.authRequired(paramName),
      status: HttpStatus.UNAUTHORIZED,
      level: 'trace',
    });
  }

  throw403Error(paramName: string, message?: string) {
    const dict = this.dictService.getDictionary(ServerDict);
    throw new CustomError({
      msg1: message || dict.forbidden(paramName),
      status: HttpStatus.FORBIDDEN,
      level: 'warn',
    });
  }
}
