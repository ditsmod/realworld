import { ConnectionOptions } from 'mysql2';

const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_CHARSET } = process.env;

export class MySqlConfigService implements ConnectionOptions {
  charset = MYSQL_CHARSET;
  host = MYSQL_HOST;
  port = MYSQL_PORT ? +MYSQL_PORT : 3306;
  user = MYSQL_USER;
  password = MYSQL_PASSWORD;
  database = MYSQL_DATABASE;
  typeCast: boolean | ((field: any, next: () => void) => any) = (field, next) => {
    if (field.type == 'JSON') {
      return JSON.parse(`${field.string('utf8')}` || '');
    }
    return next();
  };
}
