import { controller } from '@holu/rest';
import { oasRoute } from '@holu/openapi';

import { OasOperationObject } from '#utils/oas-helpers.js';
import { TagsDto } from './tags.dto.js';
import { TagsService } from './tags.service.js';

@controller()
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @oasRoute('GET', '', {
    ...new OasOperationObject().getResponse(TagsDto, 'Description for response content.'),
  })
  async getTags() {
    return this.tagsService.getTags();
  }
}
