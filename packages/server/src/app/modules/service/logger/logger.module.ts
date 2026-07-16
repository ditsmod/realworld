import { ConsoleLogger, Logger, ProviderBuilder } from '@ditsmod/core';
import { restModule } from '@ditsmod/rest';
import BunyanLogger from 'bunyan';

import { PatchLogger } from './patch-logger.js';

@restModule({
  providersPerApp: new ProviderBuilder()
    .useToken(BunyanLogger, Logger)
    .useClass(Logger, ConsoleLogger)

    // Set to `true` to allow write logs to packages/server/logs
    // Of course, this must be done through an environment variable (for example, process.env.NODE_ENV == 'prod')
    .$if(false)
    .useFactory(Logger, [PatchLogger, PatchLogger.prototype.patchLogger]),
})
export class LoggerModule {}
