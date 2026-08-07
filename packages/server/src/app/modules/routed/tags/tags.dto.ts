import { property } from '@holu/openapi';

export class TagsDto {
  @property({}, { array: String })
  tags: string[];
}
