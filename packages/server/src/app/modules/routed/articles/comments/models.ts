import { property, REQUIRED } from '@ditsmod/openapi';

import { MapFollowers } from '#routed/profiles/models.js';
import { CurrUsers } from '#routed/users/models.js';
import { Author, CurrArticles } from '../models.js';

export interface Tables {
  curr_comments: CurrComments;
  curr_articles: CurrArticles;
  curr_users: CurrUsers;
  map_followers: MapFollowers;
}

export interface CurrComments {
  commentId?: number;
  userId: number;
  articleId: number;
  createdAt: number;
  updatedAt?: number;
  body: string;
}

export class Comment {
  @property()
  id: number = 0;
  @property()
  createdAt: string = '';
  @property()
  updatedAt: string = '';
  @property()
  body: string = '';
  @property()
  author: Author = new Author();
}

export class CommentData {
  @property()
  comment: Comment;
}

export class CommentsData {
  @property({}, { array: Comment })
  comments: Comment[] = [new Comment()];
}

export class CommentPost {
  @property({ [REQUIRED]: true })
  body: string;
}

export class CommentPostData {
  @property({ [REQUIRED]: true })
  comment: CommentPost;
}
