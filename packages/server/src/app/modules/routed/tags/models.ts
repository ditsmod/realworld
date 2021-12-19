import { Column } from '@ditsmod/openapi';

export class Tags {
  @Column({}, String)
  tags: string[];
}
