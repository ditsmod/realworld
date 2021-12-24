import { Injectable } from '@ts-stack/di';

import { MysqlService } from '@service/mysql/mysql.service';
import { Profile } from './models';
import { OkPacket } from 'mysql';

@Injectable()
export class DbService {
  constructor(private mysql: MysqlService) {}

  async getProfile(currentUserId: number, targetUserName: string) {
    const sql = `
    select
      username,
      bio,
      image,
      if(f.userId is null, 0, 1) as following
    from cur_users as u
    left join map_followers as f
      on u.userId = f.userId
        and f.followerId = ?
    where u.username = ?
    ;`;
    const { rows } = await this.mysql.query(sql, [currentUserId, targetUserName]);
    return (rows as Profile[])[0];
  }

  async followUser(currentUserId: number, targetUserName: string) {
    const sql = `
    insert ignore into map_followers (userId, followerId)
    select
      userId,
      ?
    from cur_users as u
    where username = ?
    ;`;
    const { rows } = await this.mysql.query(sql, [currentUserId, targetUserName]);
    return (rows as OkPacket);
  }

  async unfollowUser(currentUserId: number, targetUserName: string) {
    const sql = `
    delete f 
    from map_followers as f
    join cur_users as u
      using(userId)
    where u.username = ?
      and f.followerId = ?
    ;`;
    const { rows } = await this.mysql.query(sql, [targetUserName, currentUserId]);
    return (rows as OkPacket);
  }
}
