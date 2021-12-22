import { Injectable } from '@ts-stack/di';

import { MysqlService } from '@service/mysql/mysql.service';
import { Profile } from './models';

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
}
