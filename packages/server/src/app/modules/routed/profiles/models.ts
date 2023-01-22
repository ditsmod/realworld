import { property } from '@ditsmod/openapi';

import { CurrUsers } from '@routed/users/models';

export interface Database {
  curr_users: CurrUsers;
  map_followers: MapFollowers;
}

export interface MapFollowers {
  userId: number;
  followerId: number;
}

export class Profile {
  @property()
  username: string = '';
  @property()
  bio: string = '';
  @property()
  image: string = '';
  @property()
  following: boolean = false;
}

export class ProfileData {
  @property()
  profile: Profile = new Profile();
}
