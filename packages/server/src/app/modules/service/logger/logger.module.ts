import { ConsoleLogger, Logger, featureModule, Providers } from '@ditsmod/core';
import BunyanLogger from 'bunyan';

import { PatchLogger } from './patch-logger.js';

@featureModule({
  providersPerApp: new Providers()
    .useToken(BunyanLogger, Logger)
    .useClass(Logger, ConsoleLogger)
    .$if(false) // Set to `true` to allow write logs to packages/server/logs
    .useFactory(Logger, [PatchLogger, PatchLogger.prototype.patchLogger]),
})
export class LoggerModule {}
