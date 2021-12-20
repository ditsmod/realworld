export class ModuleConfigService {
  cryptoSecret = process.env.CRYPTO_SECRET;
  sizeXsrfToken: number = 20;
  xsrfCookieName: string = 'XSRF-TOKEN';
}
