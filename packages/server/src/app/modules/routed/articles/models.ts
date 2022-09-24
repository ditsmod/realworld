import { Column, REQUIRED } from '@ditsmod/openapi';

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
  @Column({ [REQUIRED]: true }, Article)
  articles: Article[] = [];
  @Column()
  articlesCount: number = 0;
}

export class ArticleItem {
  @Column()
  article: Article = new Article();
}

export class ArticlePost {
  @Column({ [REQUIRED]: true })
  title: string = '';
  @Column({ [REQUIRED]: true })
  description: string = '';
  @Column({ [REQUIRED]: true })
  body: string = '';
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
  @Column({ [REQUIRED]: true })
  article: ArticlePost;
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
