import { Column, REQUIRED } from '@ditsmod/openapi';

import { AppConfigService } from '@service/app-config/config.service';

const config = new AppConfigService();

export class LoginData {
  @Column({ [REQUIRED]: true, pattern: config.emailPattern.source })
  email: string;
  @Column({ [REQUIRED]: true, minLength: config.minLengthPassword, maxLength: config.maxLengthPassword })
  password: string;
}

export class SignUpData extends LoginData {
  @Column({ [REQUIRED]: true })
  username: string;
}

export class LoginFormData {
  @Column({ [REQUIRED]: true })
  user: LoginData;
}

export class SignUpFormData {
  @Column({ [REQUIRED]: true })
  user: SignUpData;
}

export class UserSession {
  @Column({ pattern: config.emailPattern.source })
  email: string = '';
  @Column()
  token: string = '';
  @Column()
  username: string = '';
  @Column({ minLength: config.minLengthBio, maxLength: config.maxLengthBio })
  bio: string = '';
  @Column({ minLength: config.minLengthUrl, maxLength: config.maxLengthUrl })
  image: string = '';
}

export class UserSessionData {
  constructor(userSession?: Partial<UserSession>) {
    this.user = { ...new UserSession(), ...(userSession || {}) };
    delete (this.user as any).userId;
  }

  @Column()
  user: UserSession;
}

export class PutUser extends UserSession {
  @Column({ minLength: config.minLengthPassword, maxLength: config.maxLengthPassword })
  password: string = '';
}

export class PutUserData {
  @Column()
  user: PutUser;
}
