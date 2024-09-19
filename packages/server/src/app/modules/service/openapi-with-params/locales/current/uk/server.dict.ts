import { ISO639 } from '@ditsmod/i18n';

import { ServerDict } from '../_base-en/server.dict.js';

export class ServerUkDict extends ServerDict {
  override getLng(): ISO639 {
    return 'uk';
  }
  /**
   * Помилка підключення до бази даних
   */
  override mysqlConnect = 'Помилка підключення до бази даних';
  /**
   * Помилка запиту до бази даних
   */
  override mysqlQuery = 'Помилка запиту до бази даних';
  /**
   * Невірне ім'я користувача
   */
  override invalidUserName = "Невірне ім'я користувача";
  /**
   * Сторінку не знайдено
   */
  override pageNotFound(paramName: string) {
    return `${paramName}: Сторінку не знайдено`;
  }
  /**
   * Необхідна авторизація
   */
  override authRequired(paramName: string) {
    return `${paramName}: Необхідна авторизація`;
  }
  /**
   * Ви не маєте доступу до даного ресурсу
   */
  override forbidden(paramName: string) {
    return `${paramName}: Ви не маєте доступу до даного ресурсу`;
  }
  /**
   * Під час коміту транзакції у Mysql сталася помилка
   */
  override errMysqlCommit = 'Під час коміту транзакції у Mysql сталася помилка';
  /**
   * Користувача із цією адресою електронної пошти чи логіном вже зареєстрований
   */
  override usernameOrEmailAlreadyExists(paramName: string) {
    return `${paramName}: Користувача із цією адресою електронної пошти чи логіном вже зареєстрований`;
  }
  /**
   * Невірний пароль чи електронна пошта
   */
  override badPasswordOrEmail(paramName: string) {
    return `${paramName}: Невірний пароль чи електронна пошта`;
  }
  /**
   * Стаття з цим слугом існує: '${slug}'
   */
  override slugExists(slug: string) {
    return `Стаття з цим слугом існує: '${slug}'`;
  }
  /**
   * Ви маєте застарілий токен
   */
  override youHaveObsoleteToken(paramName: string) {
    return `${paramName}: Ви маєте застарілий токен`;
  }
}
