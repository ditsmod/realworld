import { Controller, Req, Res } from '@ditsmod/core';
import { OasRoute } from '@ditsmod/openapi';

import { BearerGuard } from '@service/auth/bearer.guard';
import { getRequestBody, Responses } from '@models/oas-helpers';
import { ArticleItem } from '../models';

@Controller()
export class FavoriteController {
  constructor(private req: Req, private res: Res) {}

  @OasRoute('POST', '', [BearerGuard], {
    ...getRequestBody(Boolean, 'Description for requestBody.'),
    ...new Responses(ArticleItem, 'Description for response content.')
      .getUnprocessableEnryResponse(),
  })
  async postFavorite() {
    this.res.sendJson(new ArticleItem());
  }

  @OasRoute('DELETE', '', [BearerGuard], {
    ...new Responses()
      .setNotFoundResponse()
      .setNoContentResponse()
      .getUnprocessableEnryResponse(),
  })
  async Unfavorite() {
    this.res.sendJson(new ArticleItem());
  }
}
