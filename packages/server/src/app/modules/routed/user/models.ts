import { Column } from '@ditsmod/openapi';

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
