import { Column } from '@ditsmod/openapi';

import { AppConfigService } from '@service/app-config/config.service';

const config = new AppConfigService();

export class Author {
  @Column()
  username: string = '';
  @Column()
  bio: string = '';
  @Column()
  image: string = '';
  @Column()
  following: boolean = false;
}

export class Article {
  @Column()
  slug: string = '';
  @Column({ minLength: config.minLengthArticleTitle, maxLength: config.maxLengthArticleTitle })
  title: string = '';
  @Column()
  description: string = '';
  @Column()
  body: string = '';
  @Column({}, String)
  tagList: string[] = [];
  @Column()
  createdAt: string = '';
  @Column()
  updatedAt: string = '';
  @Column()
  favorited: boolean = false;
  @Column()
  favoritesCount: number = 0;
  @Column()
  author: Author = new Author();
}

export class Articles {
  @Column({}, Article)
  articles: Article[] = [];  // Required
  @Column()
  articlesCount: number = 0;
}

export class ArticleItem {
  @Column()
  article: Article = new Article();
}

export class ArticlePost {
  @Column()
  title: string = ''; // Required
  @Column()
  description: string = ''; // Required
  @Column()
  body: string = ''; // Required
  @Column(
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
  @Column()
  article: ArticlePost; // Required
}

export class ArticlePut {
  @Column()
  title?: string = '';
  @Column()
  description?: string = '';
  @Column()
  body?: string = '';
}

export class ArticlePutData {
  @Column()
  article: ArticlePut;
}
