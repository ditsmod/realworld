if (!process.env.CRYPTO_SECRET) {
  throw new Error(`You need set CRYPTO_SECRET in 'packages/server/.env'`);
}

export class ModuleConfigService {
  cryptoSecret = process.env.CRYPTO_SECRET;
  sizeXsrfToken: number = 20;
  xsrfCookieName: string = 'XSRF-TOKEN';
}
