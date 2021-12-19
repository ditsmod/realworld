import { SharedConfig } from '@shared';

export class AppConfigService extends SharedConfig {
  /**
   * If the length of the text transmitted as a parameter exceeds this value,
   * the parameter will be partially written and there will be a colon at the end.
   */
  maxLengthLogParam: number = 100;
  maxId = 1000000;
}
