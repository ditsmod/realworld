import { Logger, LoggerConfig, LogLevel, methodFactory, MethodLogLevel } from '@ditsmod/core';
import { createLogger, LogLevel as BunyanLogLevel } from 'bunyan';
import * as BunyanLogger from 'bunyan';

export class PatchLogger {
  @methodFactory()
  patchLogger(config: LoggerConfig) {
    const logger = createLogger({ name: 'bunyan-test' });
    this.setLogLeveL(logger, config.level);

    // Logger must have `log` method.
    (logger as unknown as Logger).log = (level: MethodLogLevel, ...args: any[]) => {
      const [arg1, ...rest] = args;
      (logger as unknown as Logger)[level](arg1, ...rest);
    };

    // Logger must have `setLevel` method.
    (logger as unknown as Logger).setLevel = (value: LogLevel) => {
      this.setLogLeveL(logger, value);
    };

    // Logger must have `getLevel` method.
    (logger as unknown as Logger).getLevel = () => {
      const bunyanLevels: { level: number; name: LogLevel }[] = [
        { level: 0, name: 'all' },
        { level: 10, name: 'trace' },
        { level: 20, name: 'debug' },
        { level: 30, name: 'info' },
        { level: 40, name: 'warn' },
        { level: 50, name: 'error' },
        { level: 60, name: 'fatal' },
        { level: 100, name: 'off' },
      ];
      const levelNumber = logger.level();
      const levelName = bunyanLevels.find((i) => i.level == levelNumber)?.name || config.level;
      return levelName;
    };

    return logger;
  }

  protected setLogLeveL(logger: BunyanLogger, logLevel: LogLevel) {
    if (logLevel == 'off') {
      logger.level(100);
    } else if (logLevel == 'all') {
      logger.level(0);
    } else {
      logger.level(logLevel as BunyanLogLevel);
    }
  }
}
