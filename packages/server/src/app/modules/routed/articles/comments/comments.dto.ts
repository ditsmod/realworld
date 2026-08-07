import { property, REQUIRED } from '@holu/openapi';

import { AuthorDto } from '../articles.dto.js';

export class CommentItemDto {
  @property()
  id: number = 0;
  @property()
  createdAt: string = '';
  @property()
  updatedAt: string = '';
  @property()
  body: string = '';
  @property()
  author: AuthorDto = new AuthorDto();
}

export class CommentDto {
  @property()
  comment: CommentItemDto;
}

export class CommentsDto {
  @property({}, { array: CommentItemDto })
  comments: CommentItemDto[] = [new CommentItemDto()];
}

export class CommentPostItemDto {
  @property({ [REQUIRED]: true })
  body: string;
}

export class CommentPostDto {
  @property({ [REQUIRED]: true })
  comment: CommentPostItemDto;
}
