import { ConsoleLogger, Logger, LoggerConfig, Module, Providers } from '@ditsmod/core';
import BunyanLogger from 'bunyan';

import { patchLogger } from './patch-logger';

@Module({
  providersPerApp: [
    { provide: BunyanLogger, useExisting: Logger },
    ...new Providers()
      .useLogger(new ConsoleLogger())
      // .useFactory(Logger, patchLogger, [LoggerConfig]), // Uncomment this to allow write logs to packages/server/logs
  ],
})
export class LoggerModule {}
