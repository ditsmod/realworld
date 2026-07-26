import { controller } from '@ditsmod/rest';
import { oasRoute } from '@ditsmod/openapi';

import { OasOperationObject } from '#utils/oas-helpers.js';
import { Tags } from './tags.dto.js';
import { TagsService } from './tags.service.js';

@controller()
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @oasRoute('GET', '', {
    ...new OasOperationObject().getResponse(Tags, 'Description for response content.'),
  })
  async getTags() {
    return this.tagsService.getTags();
  }
}
