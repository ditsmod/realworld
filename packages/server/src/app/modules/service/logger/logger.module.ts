import { ConsoleLogger, Logger, featureModule, Providers } from '@ditsmod/core';
import BunyanLogger = require('bunyan');

import { PatchLogger } from './patch-logger.js';

// Uncomment ".useFactory" to allow write logs to packages/server/logs
@featureModule({
  providersPerApp: [
    { token: BunyanLogger, useToken: Logger },
    ...new Providers()
      .useClass(Logger, ConsoleLogger)
      // .useFactory(Logger, [PatchLogger, PatchLogger.prototype.patchLogger]),
  ],
})
export class LoggerModule {}
