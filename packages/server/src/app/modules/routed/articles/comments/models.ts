import { property, REQUIRED } from '@ditsmod/openapi';

import { Author } from '../models.js';

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
