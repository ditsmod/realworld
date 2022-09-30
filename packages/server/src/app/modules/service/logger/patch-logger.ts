import { Logger, LoggerConfig, LogLevel } from '@ditsmod/core';
import { createLogger } from 'bunyan';

import { loggerOptions } from './logger-options';

export function patchLogger(config: LoggerConfig) {
  const logger = createLogger(loggerOptions);

  logger.level(config.level);

  // Logger must have `log` method.
  (logger as unknown as Logger).log = (level: LogLevel, ...args: any[]) => {
    const [arg1, ...rest] = args;
    logger[level](arg1, ...rest);
  };

  // Logger must have `setLevel` method.
  (logger as unknown as Logger).setLevel = (value: LogLevel) => {
    logger.level(value);
  };

  // Logger must have `getLevel` method.
  (logger as unknown as Logger).getLevel = () => {
    const bunyanLevels: { level: number; name: LogLevel }[] = [
      { level: 10, name: 'trace' },
      { level: 20, name: 'debug' },
      { level: 30, name: 'info' },
      { level: 40, name: 'warn' },
      { level: 50, name: 'error' },
      { level: 60, name: 'fatal' },
    ];
    const levelNumber = logger.level();
    const levelName = bunyanLevels.find((i) => i.level == levelNumber)?.name || config.level;
    return levelName;
  };

  return logger;
}
