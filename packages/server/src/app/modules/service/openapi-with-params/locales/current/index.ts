import { DictGroup, getDictGroup } from '@ditsmod/i18n';

import { ServerUkDict } from './uk/server.dict.js';
import { ServerDict } from './_base-en/server.dict.js';
export { ServerDict, ServerUkDict };

export const current: DictGroup[] = [
  getDictGroup(ServerDict, ServerUkDict)
];
