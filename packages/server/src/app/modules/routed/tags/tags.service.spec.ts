import { describe, it, expect, beforeEach, vi } from 'vitest';

import type { DbService } from './db.service.js';
import { TagsDto } from './tags.dto.js';
import { TagsService } from './tags.service.js';

describe('TagsService', () => {
  let tagsService: TagsService;
  let dbMock: any;

  beforeEach(() => {
    dbMock = {
      getTags: vi.fn(),
    };

    tagsService = new TagsService(dbMock as unknown as DbService);
  });

  describe('getTags', () => {
    it('should return TagsDto with list of tag names', async () => {
      dbMock.getTags.mockResolvedValue([{ tagName: 'react' }, { tagName: 'holu' }]);

      const result = await tagsService.getTags();

      expect(dbMock.getTags).toHaveBeenCalled();
      expect(result).toBeInstanceOf(TagsDto);
      expect(result.tags).toEqual(['react', 'holu']);
    });
  });
});
