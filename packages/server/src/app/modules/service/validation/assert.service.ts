import { Injectable } from '@ts-stack/di';

import { CustomError } from '@service/error-handler/custom-error';
import { ServerMsg } from '@service/msg/server-msg';
import { AppConfigService } from '@service/app-config/config.service';

@Injectable()
export class AssertService {
  constructor(private config: AppConfigService, private serverMsg: ServerMsg) {}

  boolean(name: string, value: boolean | string | number, msg1?: string, args1?: (string | number)[]) {
    let msg2: string = '';
    if (
      (typeof value != 'boolean' && typeof value != 'string' && typeof value != 'number') ||
      ((typeof value == 'string' || typeof value == 'number') &&
        value != 'true' &&
        value != 'false' &&
        value != '0' &&
        value != '1')
    ) {
      msg2 = this.serverMsg.paramIsNotBool;
    }

    if (msg2) {
      throw new CustomError({
        msg1: msg1 || this.serverMsg.wrongBoolParam,
        args1: args1 || [name],
        msg2: msg2,
        params: value,
      });
    }
  }

  /**
   * @param min If omit, have default value `0`.
   * @param max If omit, max will unchecked.
   */
  number(name: string, value: number | string, min: number = 0, max?: number, msg1?: string, args1?: (string | number)[]) {
    let msg2: string = '';
    const param = !isNaN(parseFloat(value as string)) ? +value : NaN;
    let actual: number | string = 0;

    if (isNaN(param)) {
      actual = this.reduceParamToLog(value as string);
      msg2 = this.serverMsg.paramIsNotNumber;
    } else if (param < min) {
      actual = value;
      msg2 = this.serverMsg.numberIsTooSmall;
    } else if (max !== undefined && param > max) {
      actual = value;
      msg2 = this.serverMsg.numberIsTooLarge;
    }

    if (msg2) {
      throw new CustomError({
        msg1: msg1 || this.serverMsg.wrongNumericParam,
        args1: args1 || [name, min, max || 'unknown', actual],
        msg2: msg2,
      });
    }
  }

  /**
   * @param min Minimal lengnth of the text param. If omit, have default value `0`.
   * @param max Maximal lengnth of the text param. If omit, max will unchecked.
   */
  string(name: string, value: string, min: number = 0, max?: number, msg1?: string, args1?: (string | number)[]): void {
    let msg2: string = '';
    let actual: string | number = 0;
    if (typeof value != 'string') {
      actual = this.reduceParamToLog(value);
      msg2 = this.serverMsg.paramIsNotString;
    } else if (value.length < min) {
      actual = value.length;
      msg2 = this.serverMsg.textIsTooShort;
    } else if (max !== undefined && value.length > max) {
      actual = value.length;
      msg2 = this.serverMsg.textIsTooLong;
    }

    if (msg2) {
      throw new CustomError({
        msg1: msg1 || this.serverMsg.wrongTextParam,
        args1: args1 || [name, min, max || 'unknown', actual],
        msg2: msg2,
      });
    }
  }

  /**
   * @param min Minimal lengnth of the array param. If omit, have default value `0`.
   * @param max Maximal lengnth of the array param. If omit, max will unchecked.
   */
  array(name: string, value: any[], min: number = 0, max?: number, msg1?: string, args1?: (string | number)[]) {
    let msg2: string = '';
    if (!Array.isArray(value)) msg2 = this.serverMsg.paramIsNotArray;
    else if (value.length < min) msg2 = this.serverMsg.arrayIsTooShort;
    else if (max !== undefined && value.length > max) msg2 = this.serverMsg.arrayIsTooLong;

    if (msg2) {
      throw new CustomError({
        msg1: msg1 || this.serverMsg.wrongArrayParam,
        args1: args1 || [name],
        msg2: msg2,
        params: value,
      });
    }
  }

  object(name: string, value: object, msg1?: string, args1?: (string | number)[]) {
    if (typeof value != 'object') {
      throw new CustomError({ msg1: msg1 || this.serverMsg.missingObjectProperty, args1: args1 || [name] });
    }
  }

  pattern(name: string, value: string, pattern: string | RegExp, msg1?: string, args1?: (string | number)[]) {
    if (typeof value != 'string' || !RegExp(pattern).test(value)) {
      throw new CustomError({ msg1: msg1 || this.serverMsg.wrongPatternParam, args1: args1 || [name] });
    }
  }

  id(name: string, value: number | string, msg1?: string, args1?: (string | number)[]) {
    this.number(name, value, 0, this.config.maxId, msg1, args1);
  }

  optionalId(name: string, value: number | string, msg1?: string, args1?: (string | number)[]) {
    if (value !== undefined) {
      this.id(name, value, msg1, args1);
    }
  }

  /**
   * @param min If omit, have default value `0`.
   * @param max If omit, max will unchecked.
   */
  optionalNumber(name: string, value: number | string, min: number = 0, max?: number, msg1?: string, args1?: (string | number)[]) {
    if (value !== undefined) {
      this.number(name, value, min, max, msg1, args1);
    }
  }

  /**
   * @param min Minimal lengnth of the text param. If omit, have default value `0`.
   * @param max Maximal lengnth of the text param. If omit, max will unchecked.
   */
  optionalString(name: string, value: string, min: number = 0, max?: number, msg1?: string, args1?: (string | number)[]) {
    if (value !== undefined) {
      this.string(name, value, min, max, msg1, args1);
    }
  }

  optionalBoolean(name: string, value: boolean | string | number, msg1?: string, args1?: (string | number)[]) {
    if (value !== undefined) {
      this.boolean(name, value, msg1, args1);
    }
  }

  /**
   * @param min Minimal lengnth of the text param. If omit, have default value `0`.
   * @param max Maximal lengnth of the text param. If omit, max will unchecked.
   */
  optionalArray(name: string, value: any[], min: number = 0, max?: number, msg1?: string, args1?: (string | number)[]) {
    if (value !== undefined) {
      this.array(name, value, min, max, msg1, args1);
    }
  }

  optionalObject(name: string, value: object, msg1?: string, args1?: (string | number)[]) {
    if (value !== undefined) {
      this.object(name, value, msg1, args1);
    }
  }

  private reduceParamToLog(value: string) {
    if (value === undefined) {
      return 'undefined';
    } else if (typeof value != 'string') {
      return `${typeof value} is not a string`;
    } else {
      const end = value.length > this.config.maxLengthLogParam ? '...' : '';
      return value.substring(0, this.config.maxLengthLogParam) + end;
    }
  }

  convertToBoolNumber(value: boolean | string | number): 1 | 0 {
    return this.convertToBool(value) ? 1 : 0;
  }

  convertToBool(value: boolean | string | number): boolean {
    return !value || value == 'false' || value == '0' ? false : true;
  }
}
