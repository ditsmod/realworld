import { injectable } from '@ditsmod/core';
import { ResultSetHeader } from 'mysql2';

import { MysqlService, SelectRunOptions } from '#service/mysql/mysql.service.js';
import { Profile, Tables } from './models.js';

@injectable()
export class DbService {
  constructor(private mysql: MysqlService<Tables>) {}

  getProfile(currentUserId: number, targetUserName: string) {
    return this.mysql
      .select('username', 'bio', 'image', 'if(f.userId is null, 0, 1) as following')
      .from('curr_users as u')
      .leftJoin('map_followers as f', (jb) => jb.on('u.userId = f.userId').and('f.followerId = ?'))
      .where((eb) => eb.isTrue('u.username = ?'))
      .$runHook<Profile, SelectRunOptions>({ first: true }, currentUserId, targetUserName);
  }

  followUser(currentUserId: number, targetUserName: string) {
    return this.mysql
      .insertFromSelect('map_followers', ['userId', 'followerId'], (sb) => {
        return sb
          .select('userId', '?')
          .from('curr_users as u')
          .where((eb) => eb.isTrue('username = ?'));
      })
      .ignore()
      .$runHook<ResultSetHeader>({}, currentUserId, targetUserName);
  }

  unfollowUser(currentUserId: number, targetUserName: string) {
    return this.mysql
      .delete('f')
      .from('map_followers as f')
      .join('curr_users as u', (jb) => jb.on('f.userId = u.userId'))
      .where((eb) => eb.isTrue('u.username = ?').and('f.followerId = ?'))
      .$runHook<ResultSetHeader>({}, targetUserName, currentUserId)
      ;
  }
}
