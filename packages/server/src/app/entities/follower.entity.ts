import { Entity, PrimaryColumn } from 'typeorm';

@Entity('map_followers')
export class Follower {
  @PrimaryColumn({ type: 'int', unsigned: true })
  userId: number;

  @PrimaryColumn({ type: 'int', unsigned: true })
  followerId: number;
}
