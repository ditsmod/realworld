import { property, REQUIRED } from '@ditsmod/openapi';

import { AppConfigService } from '#service/app-config/config.service.js';

const config = new AppConfigService();

export class LoginDto {
  @property({ [REQUIRED]: true, pattern: config.emailPattern.source })
  email: string;
  @property({ [REQUIRED]: true, minLength: config.minLengthPassword, maxLength: config.maxLengthPassword })
  password: string;
}

export class SignUpDto extends LoginDto {
  @property({ [REQUIRED]: true })
  username: string;
}

export class LoginFormDto {
  @property({ [REQUIRED]: true })
  user: LoginDto;
}

export class SignUpFormDto {
  @property({ [REQUIRED]: true })
  user: SignUpDto;
}

export class UserSessionDto {
  @property({ pattern: config.emailPattern.source })
  email: string = '';
  @property()
  token: string = '';
  @property()
  username: string = '';
  @property({ minLength: config.minLengthBio, maxLength: config.maxLengthBio })
  bio: string = '';
  @property({ minLength: config.minLengthUrl, maxLength: config.maxLengthUrl })
  image: string = '';
}

export class UserSessionDataDto {
  constructor(userSession?: Partial<UserSessionDto>) {
    this.user = { ...new UserSessionDto(), ...(userSession || {}) };
    delete (this.user as any).userId;
  }

  @property()
  user: UserSessionDto;
}

export class PutUserDto extends UserSessionDto {
  @property({ minLength: config.minLengthPassword, maxLength: config.maxLengthPassword })
  password: string = '';
}

export class PutUserDataDto {
  @property()
  user: PutUserDto;
}
