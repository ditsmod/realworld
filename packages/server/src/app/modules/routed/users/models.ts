import { Column } from '@ditsmod/openapi';

import { IS_REQUIRED } from '@service/validation/types';
import { AppConfigService } from '@service/app-config/config.service';

const config = new AppConfigService();

export class LoginData {
  @Column({ [IS_REQUIRED]: true, pattern: config.emailPattern.source })
  email: string;
  @Column({ [IS_REQUIRED]: true, minLength: config.minLengthPassword, maxLength: config.maxLengthPassword })
  password: string;
}

export class SignUpData extends LoginData {
  @Column({ [IS_REQUIRED]: true })
  username: string;
}

/**
 * Taken from https://gothinkster.github.io/realworld/docs/specs/backend-specs/endpoints#authentication
 */
export class LoginFormData {
  @Column({ [IS_REQUIRED]: true })
  user: LoginData;
}

/**
 * Taken from https://gothinkster.github.io/realworld/docs/specs/backend-specs/endpoints#registration
 */
export class SignUpFormData {
  @Column({ [IS_REQUIRED]: true })
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

/**
 * Taken from https://gothinkster.github.io/realworld/docs/specs/backend-specs/api-response-format/#users-for-authentication
 */
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

/**
 * Taken from https://gothinkster.github.io/realworld/docs/specs/backend-specs/endpoints#update-user
 */
export class PutUserData {
  @Column()
  user: PutUser;
}
