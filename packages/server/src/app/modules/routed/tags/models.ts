import { Property } from '@ditsmod/openapi';

export class Tags {
  @Property({}, { array: String })
  tags: string[];
}
