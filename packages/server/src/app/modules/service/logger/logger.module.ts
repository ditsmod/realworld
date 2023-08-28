import { ConsoleLogger, Logger, featureModule, Providers } from '@ditsmod/core';
import BunyanLogger = require('bunyan');

import { PatchLogger } from './patch-logger.js';

@featureModule({
  providersPerApp: [
    { token: BunyanLogger, useToken: Logger },
    ...new Providers()
      .useLogger(new ConsoleLogger())
      // .useFactory(Logger, [PatchLogger, PatchLogger.prototype.patchLogger]), // Uncomment this to allow write logs to packages/server/logs
  ],
})
export class LoggerModule {}
