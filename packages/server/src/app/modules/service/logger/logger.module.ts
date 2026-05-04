import { ConsoleLogger, Logger, featureModule, Providers } from '@ditsmod/core';
import BunyanLogger from 'bunyan';

import { PatchLogger } from './patch-logger.js';

@featureModule({
  providersPerApp: new Providers()
    .useToken(BunyanLogger, Logger)
    .useClass(Logger, ConsoleLogger)

    // Set to `true` to allow write logs to packages/server/logs
    // Of course, this must be done through an environment variable (for example, process.env.NODE_ENV == 'prod')
    .$if(false)
    .useFactory(Logger, [PatchLogger, PatchLogger.prototype.patchLogger]),
})
export class LoggerModule {}
