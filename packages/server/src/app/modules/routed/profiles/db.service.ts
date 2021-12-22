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
      if(f.user_id is null, 0, 1) as following
    from cur_users as u
    left join map_followers as f
      on u.user_id = f.user_id
        and f.follower_id = ?
    where u.username = ?
    ;`;
    const { rows } = await this.mysql.query(sql, [currentUserId, targetUserName]);
    return (rows as Profile[])[0];
  }

  async followUser(currentUserId: number, targetUserName: string) {
    const sql = `
    insert ignore into map_followers (user_id, follower_id)
    select
      user_id,
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
      using(user_id)
    where u.username = ?
      and f.follower_id = ?
    ;`;
    const { rows } = await this.mysql.query(sql, [targetUserName, currentUserId]);
    return (rows as OkPacket);
  }
}
