import { describe, it, expect, beforeEach, vi } from 'vitest';

import type { AuthService } from '#service/auth/auth.service.js';
import type { UtilService } from '#service/util/util.service.js';
import { CommentsService } from './comments.service.js';
import type { DbService } from './db.service.js';
import { CommentData, CommentsData } from './comments.dto.js';

describe('CommentsService', () => {
  let commentsService: CommentsService;
  let dbMock: any;
  let authServiceMock: any;
  let utilMock: any;

  const mockDbComment = {
    commentId: 10,
    body: 'Great article!',
    createdAt: 1600000000,
    updatedAt: 1600000000,
    userId: 2,
    username: 'commenter',
    bio: 'bio',
    image: 'img.jpg',
    following: 0,
  };

  beforeEach(() => {
    dbMock = {
      postComment: vi.fn(),
      getComments: vi.fn(),
      deleteArticle: vi.fn(),
    };

    authServiceMock = {
      getCurrentUserId: vi.fn().mockResolvedValue(1),
      hasPermissions: vi.fn().mockResolvedValue(true),
    };

    utilMock = {
      throw403Error: vi.fn().mockImplementation((param, msg) => {
        throw new Error(`403: ${msg}`);
      }),
    };

    commentsService = new CommentsService(
      dbMock as unknown as DbService,
      authServiceMock as unknown as AuthService,
      utilMock as unknown as UtilService
    );
  });

  describe('postComment', () => {
    it('should post comment to DB and return CommentData DTO', async () => {
      dbMock.postComment.mockResolvedValue({ insertId: 10 });
      dbMock.getComments.mockResolvedValue({ ...mockDbComment });

      const result = await commentsService.postComment('hello-world', 'Great article!');

      expect(dbMock.postComment).toHaveBeenCalledWith(1, 'hello-world', 'Great article!');
      expect(dbMock.getComments).toHaveBeenCalledWith(1, 10);
      expect(result).toBeInstanceOf(CommentData);
      expect(result.comment.id).toBe(10);
      expect(result.comment.body).toBe('Great article!');
    });
  });

  describe('getComments', () => {
    it('should return CommentsData with mapped comments', async () => {
      dbMock.getComments.mockResolvedValue([{ ...mockDbComment }]);

      const result = await commentsService.getComments();

      expect(dbMock.getComments).toHaveBeenCalledWith(1);
      expect(result).toBeInstanceOf(CommentsData);
      expect(result.comments.length).toBe(1);
      expect(result.comments[0].id).toBe(10);
    });
  });

  describe('deleteComment', () => {
    it('should delete comment and return { ok: 1 } when user has permission and comment exists', async () => {
      dbMock.deleteArticle.mockResolvedValue({ affectedRows: 1 });

      const result = await commentsService.deleteComment(10);

      expect(dbMock.deleteArticle).toHaveBeenCalledWith(1, true, 10);
      expect(result).toEqual({ ok: 1 });
    });

    it('should throw 403 error when affectedRows is 0', async () => {
      dbMock.deleteArticle.mockResolvedValue({ affectedRows: 0 });

      await expect(commentsService.deleteComment(10)).rejects.toThrow(/403:/);
    });
  });
});
