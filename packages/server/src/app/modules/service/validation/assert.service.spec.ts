import { AssertService } from './assert.service';

import { ServerMsg } from '@service/msg/server-msg';
import { AppConfigService } from '@service/app-config/config.service';

describe(`ParamsService`, () => {
  const serverMsg = new ServerMsg();
  const assert = new AssertService(new AppConfigService(), serverMsg);

  describe(`checkId()`, () => {
    it(`case 1`, () => {
      expect(() => assert.id('idParam', '')).toThrowError(`${serverMsg.wrongNumericParam}`);
      expect(() => assert.id('idParam', '1d')).toThrowError(`${serverMsg.wrongNumericParam}`);
      expect(() => assert.id('idParam', '-1')).toThrowError(`${serverMsg.wrongNumericParam}`);
    });

    it(`case 2`, () => {
      expect(() => assert.id('idParam', '0')).not.toThrow();
      expect(() => assert.id('idParam', '1')).not.toThrow();
      expect(() => assert.id('idParam', '1111')).not.toThrow();
    });
  });

  describe(`checkNumber()`, () => {
    it(`case 1`, () => {
      expect(() => assert.number('numberParam', '', 1, 2)).toThrowError(`${serverMsg.wrongNumericParam}`);
      expect(() => assert.number('numberParam', '1d', 1, 2)).toThrowError(`${serverMsg.wrongNumericParam}`);
      expect(() => assert.number('numberParam', '0', 1, 2)).toThrowError(`${serverMsg.wrongNumericParam}`);
      expect(() => assert.number('numberParam', '-1')).toThrowError(`${serverMsg.wrongNumericParam}`);
      expect(() => assert.number('numberParam', '3', 1, 2)).toThrowError(`${serverMsg.wrongNumericParam}`);
    });

    it(`case 2`, () => {
      expect(() => assert.number('numberParam', '1', 1, 2)).not.toThrow();
      expect(() => assert.number('numberParam', '2', 1, 2)).not.toThrow();
      expect(() => assert.number('numberParam', '1')).not.toThrow();
      expect(() => assert.number('numberParam', '1111')).not.toThrow();
    });
  });

  describe(`checkText()`, () => {
    it(`case 1`, () => {
      expect(() => assert.string('stringParam', '', 1, 2)).toThrowError(`${serverMsg.wrongTextParam}`);
      expect(() => assert.string('stringParam', '111', 1, 2)).toThrowError(`${serverMsg.wrongTextParam}`);
      expect(() => assert.string('stringParam', '111', 2, 2)).toThrowError(`${serverMsg.wrongTextParam}`);
      expect(() => assert.string('stringParam', 1 as any, 1, 2)).toThrowError(`${serverMsg.wrongTextParam}`);
      const msg = serverMsg.invalidUserName;
      expect(() => assert.string('stringParam', '111', 2, 2, msg)).toThrowError(`${msg}`);
    });

    it(`case 2`, () => {
      expect(() => assert.string('stringParam', '')).not.toThrow();
      expect(() => assert.string('stringParam', '111')).not.toThrow();
      expect(() => assert.string('stringParam', '1', 1, 2)).not.toThrow();
      expect(() => assert.string('stringParam', '11', 1, 2)).not.toThrow();
      expect(() => assert.string('stringParam', '11', 2, 2)).not.toThrow();
    });
  });

  describe(`checkBoolean()`, () => {
    it(`case 1`, () => {
      expect(() => assert.boolean('booleanParam', '')).toThrowError(`${serverMsg.wrongBoolParam}`);
      expect(() => assert.boolean('booleanParam', '111')).toThrowError(`${serverMsg.wrongBoolParam}`);
      expect(() => assert.boolean('booleanParam', 'aaa')).toThrowError(`${serverMsg.wrongBoolParam}`);
      expect(() => assert.boolean('booleanParam', {} as any)).toThrowError(`${serverMsg.wrongBoolParam}`);
      expect(() => assert.boolean('booleanParam', 11 as any)).toThrowError(`${serverMsg.wrongBoolParam}`);
    });

    it(`case 2`, () => {
      expect(() => assert.boolean('booleanParam', 'true')).not.toThrow();
      expect(() => assert.boolean('booleanParam', 'false')).not.toThrow();
      expect(() => assert.boolean('booleanParam', '0')).not.toThrow();
      expect(() => assert.boolean('booleanParam', '1')).not.toThrow();
      expect(() => assert.boolean('booleanParam', 0)).not.toThrow();
      expect(() => assert.boolean('booleanParam', 1)).not.toThrow();
      expect(() => assert.boolean('booleanParam', true)).not.toThrow();
      expect(() => assert.boolean('booleanParam', false)).not.toThrow();
    });
  });

  describe(`checkArray()`, () => {
    it(`case 1`, () => {
      expect(() => assert.array('arrayParam', '' as any)).toThrowError(`${serverMsg.wrongArrayParam}`);
      expect(() => assert.array('arrayParam', '111' as any)).toThrowError(`${serverMsg.wrongArrayParam}`);
      expect(() => assert.array('arrayParam', {} as any)).toThrowError(`${serverMsg.wrongArrayParam}`);
      expect(() => assert.array('arrayParam', 11 as any)).toThrowError(`${serverMsg.wrongArrayParam}`);
    });

    it(`case 2`, () => {
      expect(() => assert.array('arrayParam', [])).not.toThrow();
      expect(() => assert.array('arrayParam', [1])).not.toThrow();
    });
  });

  describe(`convertToBool()`, () => {
    it(`case 1`, () => {
      expect(assert.convertToBool(true)).toBe(true);
      expect(assert.convertToBool('true')).toBe(true);
      expect(assert.convertToBool('1')).toBe(true);
      expect(assert.convertToBool(1)).toBe(true);
      expect(assert.convertToBool(false)).toBe(false);
      expect(assert.convertToBool('false')).toBe(false);
      expect(assert.convertToBool('')).toBe(false);
      expect(assert.convertToBool('0')).toBe(false);
      expect(assert.convertToBool(0)).toBe(false);
    });
  });

  describe(`convertToBoolNumber()`, () => {
    it(`case 1`, () => {
      expect(assert.convertToBoolNumber(true)).toBe(1);
      expect(assert.convertToBoolNumber(false)).toBe(0);
    });
  });
});
