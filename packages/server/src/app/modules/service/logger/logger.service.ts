import { Logger as BunyanLogger, LoggerOptions } from '@ditsmod/logger';
import { Injectable, Inject } from '@ts-stack/di';

import { LOGGER_OPTIONS } from './types';

@Injectable()
export class LoggerService extends BunyanLogger {
  constructor(@Inject(LOGGER_OPTIONS) optiions: LoggerOptions) {
    super(optiions);
  }
}
