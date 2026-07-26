import { injectable } from '@ditsmod/core';
import { injectRepository } from '@ditsmod/typeorm';
import { Repository } from 'typeorm';

import { UserEntity, FollowerEntity } from '#app/entities/index.js';
import { ProfileDto } from './profiles.dto.js';

@injectable()
export class DbService {
  constructor(
    @injectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @injectRepository(FollowerEntity) private followerRepo: Repository<FollowerEntity>
  ) {}

  async getProfile(currentUserId: number, targetUserName: string): Promise<ProfileDto | undefined> {
    const qb = this.userRepo
      .createQueryBuilder('u')
      .select(['u.username AS username', 'u.bio AS bio', 'u.image AS image', 'IF(f.userId IS NULL, 0, 1) AS following'])
      .leftJoin(FollowerEntity, 'f', 'u.userId = f.userId AND f.followerId = :currentUserId', { currentUserId })
      .where('u.username = :targetUserName', { targetUserName });

    return qb.getRawOne();
  }

  async followUser(currentUserId: number, targetUserName: string) {
    const targetUser = await this.userRepo.findOneBy({ username: targetUserName });
    if (!targetUser) return;

    const existing = await this.followerRepo.findOneBy({
      userId: targetUser.userId,
      followerId: currentUserId,
    });
    if (!existing) {
      await this.followerRepo.save({
        userId: targetUser.userId,
        followerId: currentUserId,
      });
    }
  }

  async unfollowUser(currentUserId: number, targetUserName: string) {
    const targetUser = await this.userRepo.findOneBy({ username: targetUserName });
    if (!targetUser) return;

    await this.followerRepo.delete({
      userId: targetUser.userId,
      followerId: currentUserId,
    });
  }
}
