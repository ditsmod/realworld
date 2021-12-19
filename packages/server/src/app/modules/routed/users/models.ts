import { Column } from '@ditsmod/openapi';

import { IS_REQUIRED } from '@service/validation/types';

export class LoginUser {
  @Column({ [IS_REQUIRED]: true })
  email: string;
  @Column({ [IS_REQUIRED]: true })
  password: string;
}

export class SignUser extends LoginUser {
  @Column({ [IS_REQUIRED]: true })
  username: string;
}

/**
 * Taken from https://gothinkster.github.io/realworld/docs/specs/backend-specs/endpoints#authentication
 */
export class LoginData {
  @Column({ [IS_REQUIRED]: true })
  user: LoginUser;
}

/**
 * Taken from https://gothinkster.github.io/realworld/docs/specs/backend-specs/endpoints#registration
 */
export class SignUpData {
  @Column({ [IS_REQUIRED]: true })
  user: SignUser;
}

export class User {
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
export class UserForAuth {
  @Column()
  user: User = new User();
}
