import { Dictionary, ISO639 } from '@ditsmod/i18n';

export class ServerDict implements Dictionary {
  getLng(): ISO639 {
    return 'en';
  }
  /**
   * Database query error
   */
  mysqlConnect = 'Database query error';
  /**
   * Database connect error
   */
  mysqlQuery = 'Database connect error';
  /**
   * Invalid user name
   */
  invalidUserName = `Invalid user name`;
  pageNotFound = `Page not found`;
  authRequired = `UNAUTHORIZED`;
  forbidden = `Forbidden`;
  /**
   * An error occurred during the Mysql transaction commit
   */
  errMysqlCommit = `An error occurred during the Mysql transaction commit`;
  /**
   * A user with this email or username is already registered
   */
   usernameOrEmailAlreadyExists = `A user with this email or username is already registered`;
  /**
   * Bad password or email
   */
   badPasswordOrEmail = `Bad password or email`;
  /**
   * Article with this slug exists: '%s'
   */
   slugExists(slug: string) {
    return `Article with this slug exists: '${slug}'`;
  }
  /**
   * You have an outdated token
   */
   youHaveObsoleteToken = `You have an outdated token`;
}
