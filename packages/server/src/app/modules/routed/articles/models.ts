import { property, REQUIRED } from '@ditsmod/openapi';

import { AppConfigService } from '#service/app-config/config.service.js';

const config = new AppConfigService();

export class Author {
  @property()
  username: string = '';
  @property()
  bio: string = '';
  @property()
  image: string = '';
  @property()
  following: boolean = false;
}

export class Article {
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
  author: Author = new Author();
}

export class Articles {
  @property({ [REQUIRED]: true }, { array: Article })
  articles: Article[] = [];
  @property()
  articlesCount: number = 0;
}

export class ArticleItem {
  @property()
  article: Article = new Article();
}

export class ArticlePost {
  @property({ [REQUIRED]: true })
  title: string = '';
  @property({ [REQUIRED]: true })
  description: string = '';
  @property({ [REQUIRED]: true })
  body: string = '';
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

export class ArticlePostData {
  @property({ [REQUIRED]: true })
  article: ArticlePost;
}

export class ArticlePut {
  @property()
  title?: string = '';
  @property()
  description?: string = '';
  @property()
  body?: string = '';
}

export class ArticlePutData {
  @property()
  article: ArticlePut;
}
