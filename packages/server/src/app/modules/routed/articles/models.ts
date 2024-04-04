import { property, REQUIRED } from '@ditsmod/openapi';

import { MapFollowers } from '#routed/profiles/models.js';
import { CurrUsers } from '#routed/users/models.js';
import { AppConfigService } from '#service/app-config/config.service.js';

const config = new AppConfigService();

export interface Tables {
  curr_users: CurrUsers;
  curr_articles: CurrArticles;
  dict_tags: DictTags;
  map_articles_tags: MapArticlesTags;
  map_followers: MapFollowers;
  map_favorites: MapFavorites;
}

export interface MapArticlesTags {
  articleId: number;
  tagId: number;
}

export interface MapFavorites {
  articleId: number;
  userId: number;
}

export interface CurrArticles {
  articleId?: number;
  userId: number;
  body: string;
  slug: string;
  title: string;
  description: string;
  tagList?: string;
  createdAt?: number;
  updatedAt?: number;
  favoritesCount?: number;
}

export interface DictTags {
  tagId?: number;
  tagName: string;
  creatorId: number;
  createdAt?: number;
}

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
