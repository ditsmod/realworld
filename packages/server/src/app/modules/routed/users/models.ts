import { Property, REQUIRED } from '@ditsmod/openapi';

import { AppConfigService } from '@service/app-config/config.service';

const config = new AppConfigService();

export class LoginData {
  @Property({ [REQUIRED]: true, pattern: config.emailPattern.source })
  email: string;
  @Property({ [REQUIRED]: true, minLength: config.minLengthPassword, maxLength: config.maxLengthPassword })
  password: string;
}

export class SignUpData extends LoginData {
  @Property({ [REQUIRED]: true })
  username: string;
}

export class LoginFormData {
  @Property({ [REQUIRED]: true })
  user: LoginData;
}

export class SignUpFormData {
  @Property({ [REQUIRED]: true })
  user: SignUpData;
}

export class UserSession {
  @Property({ pattern: config.emailPattern.source })
  email: string = '';
  @Property()
  token: string = '';
  @Property()
  username: string = '';
  @Property({ minLength: config.minLengthBio, maxLength: config.maxLengthBio })
  bio: string = '';
  @Property({ minLength: config.minLengthUrl, maxLength: config.maxLengthUrl })
  image: string = '';
}

export class UserSessionData {
  constructor(userSession?: Partial<UserSession>) {
    this.user = { ...new UserSession(), ...(userSession || {}) };
    delete (this.user as any).userId;
  }

  @Property()
  user: UserSession;
}

export class PutUser extends UserSession {
  @Property({ minLength: config.minLengthPassword, maxLength: config.maxLengthPassword })
  password: string = '';
}

export class PutUserData {
  @Property()
  user: PutUser;
}
