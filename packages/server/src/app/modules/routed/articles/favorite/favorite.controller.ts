import { Controller, Req, Res, Status } from '@ditsmod/core';
import { getContent, OasRoute } from '@ditsmod/openapi';

import { BearerGuard } from '@service/auth/bearer.guard';
import { getNoContent, getRequestBody, getResponses } from '@models/oas-helpers';
import { ArticleItem } from '../models';

@Controller()
export class FavoriteController {
  constructor(private req: Req, private res: Res) {}

  @OasRoute('POST', '', [BearerGuard], {
    ...getRequestBody(Boolean, 'Description for requestBody.'),
    ...getResponses(ArticleItem, 'Description for response content.', Status.OK, false),
  })
  async postFavorite() {
    this.res.sendJson(new ArticleItem());
  }

  @OasRoute('DELETE', '', [BearerGuard], {
    ...getNoContent(),
  })
  async Unfavorite() {
    this.res.sendJson(new ArticleItem());
  }
}