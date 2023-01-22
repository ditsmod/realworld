import { injectable } from '@ditsmod/core';
import { sql } from 'kysely';

import { MysqlService } from '@service/mysql/mysql.service';
import { Database } from './models';

@injectable()
export class DbService {
  constructor(private mysql: MysqlService) {}

  async getProfile(currentUserId: number, targetUserName: string) {
    const db = await this.mysql.getKysely<Database>();
    return db
      .selectFrom('curr_users as u')
      .leftJoin('map_followers as f', (jb) =>
        jb.onRef('u.userId', '=', 'f.userId').on('f.followerId', '=', currentUserId)
      )
      .select(['username', 'bio', 'image', sql<string | boolean>`if(f.userId is null, 0, 1)`.as('following')])
      .where('username', '=', targetUserName)
      .executeTakeFirst();
  }

  async followUser(currentUserId: number, targetUserName: string) {
    const db = await this.mysql.getKysely<Database>();
    return db
      .insertInto('map_followers')
      .ignore()
      .columns(['userId', 'followerId'])
      .expression((eb) =>
        eb
          .selectFrom('curr_users as u')
          .select(['u.userId', sql<string>`${currentUserId}`.as('currentUserId')])
          .where('u.username', '=', targetUserName)
      )
      .executeTakeFirst();
  }

  async unfollowUser(currentUserId: number, targetUserName: string) {
    const db = await this.mysql.getKysely<Database>();
    return db
      .deleteFrom('f' as any)
      .using('map_followers as f')
      .innerJoin('curr_users as u', 'f.userId', 'u.userId')
      .where('u.username', '=', targetUserName)
      .where('f.followerId', '=', currentUserId)
      .executeTakeFirst();
  }
}
