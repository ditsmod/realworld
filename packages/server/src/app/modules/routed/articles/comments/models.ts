import { Property, REQUIRED } from '@ditsmod/openapi';

import { Author } from '../models';

export class Comment {
  @Property()
  id: number = 0;
  @Property()
  createdAt: string = '';
  @Property()
  updatedAt: string = '';
  @Property()
  body: string = '';
  @Property()
  author: Author = new Author();
}

export class CommentData {
  @Property()
  comment: Comment;
}

export class CommentsData {
  @Property({}, Comment)
  comments: Comment[] = [new Comment()];
}

export class CommentPost {
  @Property({ [REQUIRED]: true })
  body: string;
}

export class CommentPostData {
  @Property({ [REQUIRED]: true })
  comment: CommentPost;
}
