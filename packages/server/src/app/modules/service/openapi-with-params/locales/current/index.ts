import { DictGroup, getDictGroup } from '@ditsmod/i18n';

import { ServerUkDict } from './uk/server.dict';
import { ServerDict } from './_base-en/server.dict';
export { ServerDict, ServerUkDict };

export const current: DictGroup[] = [
  getDictGroup(ServerDict, ServerUkDict)
];
