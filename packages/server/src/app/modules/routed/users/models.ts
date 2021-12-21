import { Column } from '@ditsmod/openapi';

import { IS_REQUIRED } from '@service/validation/types';
import { AppConfigService } from '@service/app-config/config.service';
import { ServerMsg } from '@service/msg/server-msg';

const config = new AppConfigService();
const serverMsg = new ServerMsg();

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
  @Column()
  email: string = '';
  @Column()
  token: string = '';
  @Column()
  username: string = '';
  @Column()
  bio: string = '';
  @Column()
  image: string = '';
}

/**
 * Taken from https://gothinkster.github.io/realworld/docs/specs/backend-specs/api-response-format/#users-for-authentication
 */
export class UserSessionData {
  constructor(userSession?: Partial<UserSession>) {
    this.user = { ...new UserSession(), ...(userSession || {}) };
    delete (this.user as any).user_id;
  }

  @Column()
  user: UserSession;
}

export class PutUser {
  @Column()
  email: string = '';
  @Column()
  username: string = '';
  @Column()
  password: string = '';
  @Column()
  image: string = '';
  @Column()
  bio: string = '';
}

/**
 * Taken from https://gothinkster.github.io/realworld/docs/specs/backend-specs/endpoints#update-user
 */
export class PutUserData {
  @Column()
  user: PutUser;
}
