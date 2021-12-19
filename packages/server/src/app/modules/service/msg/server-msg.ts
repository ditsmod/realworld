export class ServerMsg {
  /**
   * Database query error
   */
  mysqlConnect = 'Database query error';
  /**
   * Database connect error
   */
  mysqlQuery = 'Database connect error';
  /**
   * Invalid numeric parameter '%s': number must be between %s and %s (actual %s)
   */
  wrongNumericParam = `Invalid numeric parameter '%s': number must be between %s and %s (actual %s)`;
  /**
   * Param '%s' is not number
   */
  paramIsNotNumber = `Param '%s' is not number`;
  /**
   * The parameter '%s' is too small
   */
  numberIsTooSmall = `The parameter '%s' is too small`;
  /**
   * The parameter '%s' is too large
   */
  numberIsTooLarge = `The parameter '%s' is too large`;
  /**
   * Invalid text parameter '%s': text must be between %s and %s characters (actual %s)
   */
  wrongTextParam = `Invalid text parameter '%s': text must be between %s and %s characters (actual %s)`;
  /**
   * The text parameter '%s' is too short
   */
  textIsTooShort = `The text parameter '%s' is too short`;
  /**
   * The text parameter '%s' is too long
   */
  textIsTooLong = `The text parameter '%s' is too long`;
  /**
   * The parameter '%s' is not a text
   */
  paramIsNotString = `The parameter '%s' is not a text`;
  /**
   * The parameter '%s' is not a boolean
   */
  paramIsNotBool = `The parameter '%s' is not a boolean`;
  /**
   * Invalid boolean parameter '%s'
   */
  wrongBoolParam = `Invalid boolean parameter '%s'`;
  /**
   * Invalid user name
   */
  invalidUserName = `Invalid user name`;
  pageNotFound = `Page not found`;
  forbidden = `Forbidden`;
  /**
   * Invalid parameter '%s' with array
   */
  wrongArrayParam = `Invalid parameter '%s' with array`;
  /**
   * The parameter '%s' is not an array
   */
  paramIsNotArray = `The parameter '%s' is not an array`;
  /**
   * '%s' array is too short
   */
  arrayIsTooShort = `'%s' array is too short`;
  /**
   * '%s' array is too long
   */
  arrayIsTooLong = `'%s' array is too long`;
  /**
   * An error occurred during the Mysql transaction commit
   */
  errMysqlCommit = `An error occurred during the Mysql transaction commit`;
  /**
   * The parameter '%s' does not match the pattern
   */
  wrongPatternParam = `The parameter '%s' does not match the pattern`;
  /**
   * Missing request body
   */
   missingRequestBody = `Missing request body`;
  /**
   * Missing object in '%s' property
   */
   missingObjectProperty = `Missing object in '%s' property`;
}
