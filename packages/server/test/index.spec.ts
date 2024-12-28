import { createConnection } from 'mysql2/promise';
import { TestApplication } from '@ditsmod/testing';
import * as newman from 'newman';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { HttpServer } from '@ditsmod/core';

import { AppModule } from '#app/app.module.js';
import { MySqlConfigService } from '#service/mysql/mysql-config.service.js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import postmanCollection from '#postman-collection';

describe('postman tests', () => {
  let server: HttpServer;

  beforeAll(async () => {
    server = await TestApplication.createTestApp(AppModule, { path: 'api' }).getServer();
    const config = new MySqlConfigService();
    const connection = await createConnection({ ...config, multipleStatements: true });
    await connection.query(`
    SET FOREIGN_KEY_CHECKS=0;
    truncate curr_articles;
    truncate curr_comments;
    truncate curr_users;
    truncate dict_tags;
    truncate map_articles_tags;
    truncate map_favorites;
    truncate map_followers;
    SET FOREIGN_KEY_CHECKS=1;`);
  });

  afterAll(() => {
    server?.close();
  });

  describe('run tests with newman', () => {
    it('hello, world', () => {
      expect.assertions(2);
      const port = 3456;

      return new Promise<void>((resolve, reject) => {
        server.listen(port, '0.0.0.0', () => {
          newman.run(
            {
              collection: postmanCollection,
              reporters: 'cli',
              envVar: [
                { key: 'APIURL', value: `http://0.0.0.0:${port}/api` },
                { key: 'EMAIL', value: 'any-email@gmail.com' },
                { key: 'USERNAME', value: 'any-username' },
                { key: 'PASSWORD', value: 'any-password' },
              ],
              delayRequest: 0,
            },
            (err, summary) => {
              if (err) {
                reject(err);
              }
              expect(summary.error).toBeFalsy();
              expect(summary.run.failures.length).toBe(0);
              resolve();
            }
          );
        });
      });
    });
  });
});
