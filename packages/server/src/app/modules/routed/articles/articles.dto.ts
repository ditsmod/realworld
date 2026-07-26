import { property, REQUIRED } from '@ditsmod/openapi';

import { AppConfigService } from '#service/app-config/config.service.js';

const config = new AppConfigService();

export class AuthorDto {
  @property()
  username: string = '';
  @property()
  bio: string = '';
  @property()
  image: string = '';
  @property()
  following: boolean = false;
}

export class ArticleDto {
  @property()
  slug: string = '';
  @property({ minLength: config.minLengthArticleTitle, maxLength: config.maxLengthArticleTitle })
  title: string = '';
  @property()
  description: string = '';
  @property()
  body: string = '';
  @property({}, { array: String })
  tagList: string[] = [];
  @property()
  createdAt: string = '';
  @property()
  updatedAt: string = '';
  @property()
  favorited: boolean = false;
  @property()
  favoritesCount: number = 0;
  @property()
  author: AuthorDto = new AuthorDto();
}

export class ArticlesDto {
  @property({ [REQUIRED]: true }, { array: ArticleDto })
  articles: ArticleDto[] = [];
  @property()
  articlesCount: number = 0;
}

export class ArticleItemDto {
  @property()
  article: ArticleDto = new ArticleDto();
}

export class ArticlePutDto {
  @property()
  title?: string = '';
  @property()
  description?: string = '';
  @property()
  body?: string = '';
}

export class ArticlePutDataDto {
  @property()
  article: ArticlePutDto;
}

export class ArticlePostDto extends ArticlePutDto {
  @property({ [REQUIRED]: true })
  override title: string = '';
  @property({ [REQUIRED]: true })
  override description: string = '';
  @property({ [REQUIRED]: true })
  override body: string = '';
  @property(
    {
      type: 'array',
      maxItems: config.maxItemsTagsPerArticle,
      items: { type: 'string', minLength: config.minLengthTag, maxLength: config.maxLengthTag },
    },
    { array: String }
  )
  tagList?: string[] = [];
}

export class ArticlePostDataDto {
  @property({ [REQUIRED]: true })
  article: ArticlePostDto;
}
