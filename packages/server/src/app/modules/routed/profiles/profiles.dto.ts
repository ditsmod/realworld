import { property } from '@ditsmod/openapi';

export class ProfileItemDto {
  @property()
  username: string = '';
  @property()
  bio: string = '';
  @property()
  image: string = '';
  @property()
  following: boolean = false;
}

export class ProfileDto {
  @property()
  profile: ProfileItemDto = new ProfileItemDto();
}
