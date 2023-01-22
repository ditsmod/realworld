import { property, REQUIRED } from '@ditsmod/openapi';
import { Generated } from 'kysely';

import { AppConfigService } from '@service/app-config/config.service';

export interface Database {
  curr_users: CurrUsers
}

export interface CurrUsers {
  userId: Generated<number>;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  password: string;
}

const config = new AppConfigService();

export class LoginData {
  @property({ [REQUIRED]: true, pattern: config.emailPattern.source })
  email: string;
  @property({ [REQUIRED]: true, minLength: config.minLengthPassword, maxLength: config.maxLengthPassword })
  password: string;
}

export class SignUpData extends LoginData {
  @property({ [REQUIRED]: true })
  username: string;
}

export class LoginFormData {
  @property({ [REQUIRED]: true })
  user: LoginData;
}

export class SignUpFormData {
  @property({ [REQUIRED]: true })
  user: SignUpData;
}

export class UserSession {
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

export class UserSessionData {
  constructor(userSession?: Partial<UserSession>) {
    this.user = { ...new UserSession(), ...(userSession || {}) };
    delete (this.user as any).userId;
  }

  @property()
  user: UserSession;
}

export class PutUser extends UserSession {
  @property({ minLength: config.minLengthPassword, maxLength: config.maxLengthPassword })
  password: string = '';
}

export class PutUserData {
  @property()
  user: PutUser;
}
