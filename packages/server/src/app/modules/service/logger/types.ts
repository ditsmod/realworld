import { InjectionToken } from '@ts-stack/di';
import { LoggerOptions } from '@ditsmod/logger';

export const LOGGER_OPTIONS = new InjectionToken<LoggerOptions>('LOGGER_OPTIONS');
