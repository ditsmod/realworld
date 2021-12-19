import { Column } from '@ditsmod/openapi';
import { IS_REQUIRED } from '@service/validation/types';

export class Author {
  @Column()
  username: string;
  @Column()
  bio: string;
  @Column()
  image: string;
  @Column()
  following: boolean;
}

export class Article {
  @Column()
  slug: string = '';
  @Column()
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
  articles: Article[] = [new Article()];
  @Column()
  articlesCount: number = 0;
}

export class ArticleItem {
  @Column({}, Article)
  article: Article = new Article();
}

export class ArticlePost {
  @Column({ [IS_REQUIRED]: true })
  title: string;
  @Column({ [IS_REQUIRED]: true })
  description: string;
  @Column({ [IS_REQUIRED]: true })
  body: string;
  @Column({}, String)
  tagList: string[];
}

export class ArticlePostData {
  @Column()
  article: ArticlePost;
}
