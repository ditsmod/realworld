import { property, REQUIRED } from '@ditsmod/openapi';

import { AuthorDto } from '../articles.dto.js';

export class CommentDto {
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

export class CommentDataDto {
  @property()
  comment: CommentDto;
}

export class CommentsDto {
  @property({}, { array: CommentDto })
  comments: CommentDto[] = [new CommentDto()];
}

export class CommentPostDto {
  @property({ [REQUIRED]: true })
  body: string;
}

export class CommentPostDataDto {
  @property({ [REQUIRED]: true })
  comment: CommentPostDto;
}
