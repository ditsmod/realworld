import { Column } from '@ditsmod/openapi';

export class Profile {
  @Column()
  username: string = '';
  @Column()
  bio: string = '';
  @Column()
  image: string = '';
  @Column()
  following: boolean = false;
}

export class ProfileData {
  @Column()
  profile: Profile = new Profile();
}
