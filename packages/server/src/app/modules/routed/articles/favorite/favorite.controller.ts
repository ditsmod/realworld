import { Controller, Req, Res, Status } from '@ditsmod/core';
import { getContent, OasRoute } from '@ditsmod/openapi';

import { BearerGuard } from '@service/auth/bearer.guard';
import { ArticleItem } from '../models';

@Controller()
export class FavoriteController {
  constructor(private req: Req, private res: Res) {}

  @OasRoute('POST', '', [BearerGuard], {
    requestBody: {
      description: 'Description for requestBody',
      content: getContent({ mediaType: 'application/json', model: Boolean }),
    },
    responses: {
      [Status.OK]: {
        description: 'Description for response content',
        content: getContent({ mediaType: 'application/json', model: ArticleItem }),
      },
    },
  })
  async postFavorite() {
    this.res.sendJson(new ArticleItem());
  }

  @OasRoute('DELETE', '', [BearerGuard], {
    responses: {
      [Status.OK]: {
        description: 'Description for response content',
        content: getContent({ mediaType: 'application/json', model: ArticleItem }),
      },
    },
  })
  async Unfavorite() {
    this.res.sendJson(new ArticleItem());
  }
}