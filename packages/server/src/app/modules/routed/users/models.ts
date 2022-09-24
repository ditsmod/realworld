import { Column } from '@ditsmod/openapi';

import { AppConfigService } from '@service/app-config/config.service';

const config = new AppConfigService();

export class LoginData {
  @Column({ pattern: config.emailPattern.source })
  email: string; // Required
  @Column({ minLength: config.minLengthPassword, maxLength: config.maxLengthPassword })
  password: string; // Required
}

export class SignUpData extends LoginData {
  @Column()
  username: string; // Required
}

export class LoginFormData {
  @Column()
  user: LoginData; // Required
}

export class SignUpFormData {
  @Column()
  user: SignUpData; // Required
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
