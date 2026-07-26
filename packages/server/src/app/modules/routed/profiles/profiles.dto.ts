import { property } from '@ditsmod/openapi';

export class ProfileDto {
  @property()
  username: string = '';
  @property()
  bio: string = '';
  @property()
  image: string = '';
  @property()
  following: boolean = false;
}

export class ProfileDataDto {
  @property()
  profile: ProfileDto = new ProfileDto();
}
