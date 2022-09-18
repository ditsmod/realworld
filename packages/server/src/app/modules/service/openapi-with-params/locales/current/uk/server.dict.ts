import { ISO639 } from '@ditsmod/i18n';

import { ServerDict } from '../_base-en/server.dict';

export class ServerUkDict extends ServerDict {
  override getLng(): ISO639 {
    return 'uk';
  }
  /**
   * Помилка запиту до бази даних
   */
  override mysqlConnect = 'Помилка запиту до бази даних';
  /**
   * Помилка підключення до бази даних
   */
  override mysqlQuery = 'Помилка підключення до бази даних';
  /**
   * Невірне ім'я користувача
   */
  override invalidUserName = `Невірне ім'я користувача`;
  /**
   * Сторінку не знайдено
   */
  override pageNotFound = `Сторінку не знайдено`;
  /**
   * Необхідна авторизація
   */
  override authRequired = `Необхідна авторизація`;
  /**
   * Ви не маєте доступу до даного ресурсу
   */
  override forbidden = `Ви не маєте доступу до даного ресурсу`;
  /**
   * Під час коміту транзакції у Mysql сталася помилка
   */
  override errMysqlCommit = `Під час коміту транзакції у Mysql сталася помилка`;
  /**
   * Користувача із цією адресою електронної пошти чи логіном вже зареєстрований
   */
  override usernameOrEmailAlreadyExists = `Користувача із цією адресою електронної пошти чи логіном вже зареєстрований`;
  /**
   * Невірний пароль чи електронна пошта
   */
  override badPasswordOrEmail = `Невірний пароль чи електронна пошта`;
  /**
   * Стаття з цим слугом існує: '${slug}'
   */
  override slugExists(slug: string) {
    return `Стаття з цим слугом існує: '${slug}'`;
  }
  /**
   * Ви маєте застарілий токен
   */
  override youHaveObsoleteToken = `Ви маєте застарілий токен`;
}
