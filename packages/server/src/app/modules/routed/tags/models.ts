import { Property } from '@ditsmod/openapi';

export class Tags {
  @Property({}, String)
  tags: string[];
}
