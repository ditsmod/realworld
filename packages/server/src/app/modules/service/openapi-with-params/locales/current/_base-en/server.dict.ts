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
  pageNotFound(paramName: string) {
    return `${paramName}: Page not found`;
  }
  authRequired(paramName: string) {
    return `${paramName}: UNAUTHORIZED`;
  }
  forbidden(paramName: string) {
    return `${paramName}: Forbidden`;
  }
  /**
   * An error occurred during the Mysql transaction commit
   */
  errMysqlCommit = `An error occurred during the Mysql transaction commit`;
  /**
   * A user with this email or username is already registered
   */
  usernameOrEmailAlreadyExists(paramName: string) {
    return `${paramName}: A user with this email or username is already registered`;
  }
  /**
   * Bad password or email
   */
  badPasswordOrEmail(paramName: string) {
    return `${paramName}: Bad password or email`;
  }
  /**
   * Article with this slug exists: '%s'
   */
  slugExists(paramName: string, slug: string) {
    return `${paramName}: Article with this slug exists: '${slug}'`;
  }
  /**
   * You have an outdated token
   */
  youHaveObsoleteToken(paramName: string) {
    return `${paramName}: You have an outdated token`;
  }
}
