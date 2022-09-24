import { Column, REQUIRED } from '@ditsmod/openapi';

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
  comments: Comment[] = [new Comment()];
}

export class CommentPost {
  @Column({ [REQUIRED]: true })
  body: string;
}

export class CommentPostData {
  @Column({ [REQUIRED]: true })
  comment: CommentPost;
}
