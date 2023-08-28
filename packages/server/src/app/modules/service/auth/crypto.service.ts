import { createHmac, randomBytes } from 'crypto';
import { NodeResponse, NODE_RES, inject, NodeRequest, NODE_REQ } from '@ditsmod/core';
import { Cookies } from '@ts-stack/cookies';
import { injectable } from '@ditsmod/core';

import { ModuleConfigService } from './config.service.js';

@injectable()
export class CryptoService {
  constructor(
    private config: ModuleConfigService,
    @inject(NODE_REQ) private nodeReq: NodeRequest,
    @inject(NODE_RES) private nodeRes: NodeResponse
  ) {}
  /**
   * Encrypts the password.
   */
  getCryptedPassword(str: string): string {
    return createHmac('sha256', this.config.cryptoSecret!).update(str).digest('hex');
  }

  /**
   * Generates a token. Its length will be twice the specified `size`.
   */
  getToken(size: number = 36): Promise<string> {
    return new Promise((resolve, reject) => {
      randomBytes(size, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const token = buf.toString('hex');
        resolve(token);
      });
    });
  }

  /**
   * Sets the XSRF token.
   */
  async setXsrf(size: number = this.config.sizeXsrfToken): Promise<void> {
    const token = await this.getToken(size);
    const cookies = new Cookies(this.nodeReq, this.nodeRes);
    cookies.set(this.config.xsrfCookieName, token, { httpOnly: false });
  }

  /**
   * Checks the `x-xsrf-token` header with a cookie.
   *
   * @todo Move this method to `ParamsService`.
   * But there is a problem here - `ParamsService` is declared at the application scope.
   */
  checkXsrf(): boolean {
    const cookies = new Cookies(this.nodeReq, this.nodeRes);
    const xsrf = cookies.get(this.config.xsrfCookieName);

    if (!xsrf || xsrf.length != this.config.sizeXsrfToken * 2) {
      return false;
    } else {
      return xsrf == this.nodeReq.headers['x-xsrf-token'];
    }
  }
}
