import { Column } from '@ditsmod/openapi';

import { Author } from '../models';

export class Comment {
  @Column()
  id: number = 0;
  @Column()
  createdAt: string = '';
  @Column()
  updatedAt: string = '';
  @Column()
  body: string = '';
  @Column()
  author: Author = new Author();
}

export class CommentData {
  @Column()
  comment: Comment;
}

export class CommentsData {
  @Column({}, Comment)
  comments: Comment[] = [new Comment];
}

export class CommentPost {
  @Column()
  body: string; // Required
}

export class CommentPostData {
  @Column()
  comment: CommentPost; // Required
}
