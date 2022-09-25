import { Property, REQUIRED } from '@ditsmod/openapi';

import { AppConfigService } from '@service/app-config/config.service';

const config = new AppConfigService();

export class Author {
  @Property()
  username: string = '';
  @Property()
  bio: string = '';
  @Property()
  image: string = '';
  @Property()
  following: boolean = false;
}

export class Article {
  @Property()
  slug: string = '';
  @Property({ minLength: config.minLengthArticleTitle, maxLength: config.maxLengthArticleTitle })
  title: string = '';
  @Property()
  description: string = '';
  @Property()
  body: string = '';
  @Property({}, String)
  tagList: string[] = [];
  @Property()
  createdAt: string = '';
  @Property()
  updatedAt: string = '';
  @Property()
  favorited: boolean = false;
  @Property()
  favoritesCount: number = 0;
  @Property()
  author: Author = new Author();
}

export class Articles {
  @Property({ [REQUIRED]: true }, Article)
  articles: Article[] = [];
  @Property()
  articlesCount: number = 0;
}

export class ArticleItem {
  @Property()
  article: Article = new Article();
}

export class ArticlePost {
  @Property({ [REQUIRED]: true })
  title: string = '';
  @Property({ [REQUIRED]: true })
  description: string = '';
  @Property({ [REQUIRED]: true })
  body: string = '';
  @Property(
    {
      type: 'array',
      maxItems: config.maxItemsTagsPerArticle,
      items: { type: 'string', minLength: config.minLengthTag, maxLength: config.maxLengthTag },
    },
    String
  )
  tagList?: string[] = [];
}

export class ArticlePostData {
  @Property({ [REQUIRED]: true })
  article: ArticlePost;
}

export class ArticlePut {
  @Property()
  title?: string = '';
  @Property()
  description?: string = '';
  @Property()
  body?: string = '';
}

export class ArticlePutData {
  @Property()
  article: ArticlePut;
}
