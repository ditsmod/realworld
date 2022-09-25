import { Property } from '@ditsmod/openapi';

export class Profile {
  @Property()
  username: string = '';
  @Property()
  bio: string = '';
  @Property()
  image: string = '';
  @Property()
  following: boolean = false;
}

export class ProfileData {
  @Property()
  profile: Profile = new Profile();
}
