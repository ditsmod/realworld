import { property } from '@ditsmod/openapi';

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
