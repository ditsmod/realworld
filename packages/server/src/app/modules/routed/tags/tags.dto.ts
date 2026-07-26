import { property } from '@ditsmod/openapi';

export class TagsDto {
  @property({}, { array: String })
  tags: string[];
}
