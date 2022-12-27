import { property } from '@ditsmod/openapi';

export class Tags {
  @property({}, { array: String })
  tags: string[];
}
