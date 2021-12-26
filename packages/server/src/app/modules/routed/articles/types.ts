export interface ArticlesSelectParams {
  tag: string;
  author: string;
  favorited: string;
  offset: number;
  limit: number;
}

export interface DbArticle {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: number;
  updatedAt: number;
  favorited: 0 | 1;
  favoritesCount: number;
  username: string;
  bio: string;
  image: string;
  following: 0 | 1;
}
