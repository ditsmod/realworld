import { Logger, LoggerConfig, Module } from '@ditsmod/core';

import { loggerOptions } from './logger-options';
import { LoggerService } from './logger.service';
import { LOGGER_OPTIONS } from './types';

const loggerConfig = new LoggerConfig();
const level: keyof Logger = 'info';
loggerConfig.level = level;

@Module({
  providersPerApp: [
    { provide: Logger, useClass: LoggerService },
    { provide: LoggerConfig, useValue: loggerConfig },
    { provide: LOGGER_OPTIONS, useValue: loggerOptions },
  ],
})
export class AppLoggerModule {}
