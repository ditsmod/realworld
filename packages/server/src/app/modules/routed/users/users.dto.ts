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

export class UserSessionItemDto {
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

export class UserSessionDto {
  constructor(userSession?: Partial<UserSessionItemDto>) {
    this.user = { ...new UserSessionItemDto(), ...(userSession || {}) };
    delete (this.user as any).userId;
  }

  @property()
  user: UserSessionItemDto;
}

export class PutUserItemDto extends UserSessionItemDto {
  @property({ minLength: config.minLengthPassword, maxLength: config.maxLengthPassword })
  password: string = '';
}

export class PutUserDto {
  @property()
  user: PutUserItemDto;
}
