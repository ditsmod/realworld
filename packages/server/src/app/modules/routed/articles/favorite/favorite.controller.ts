import { Controller, Req, Res } from '@ditsmod/core';
import { OasRoute } from '@ditsmod/openapi';

import { BearerGuard } from '@service/auth/bearer.guard';
import { getNoContentResponse, getRequestBody, getResponseWithModel } from '@models/oas-helpers';
import { ArticleItem } from '../models';

@Controller()
export class FavoriteController {
  constructor(private req: Req, private res: Res) {}

  @OasRoute('POST', '', [BearerGuard], {
    ...getRequestBody(Boolean, 'Description for requestBody.'),
    responses: { ...getResponseWithModel(ArticleItem, 'Description for response content.') },
  })
  async postFavorite() {
    this.res.sendJson(new ArticleItem());
  }

  @OasRoute('DELETE', '', [BearerGuard], {
    ...getNoContentResponse(),
  })
  async Unfavorite() {
    this.res.sendJson(new ArticleItem());
  }
}
