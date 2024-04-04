import { createConnection } from 'mysql2';
import { TestApplication } from '@ditsmod/testing';
import * as newman from 'newman';

import { AppModule } from '#app/app.module.js';
import { MySqlConfigService } from '#service/mysql/mysql-config.service.js';
import postmanCollection = require('#postman-collection');

describe('postman tests', () => {
  beforeAll((done) => {
    const config = new MySqlConfigService();
    const connection = createConnection({ ...config, multipleStatements: true });
    connection.query(`
    SET FOREIGN_KEY_CHECKS=0;
    truncate curr_articles;
    truncate curr_comments;
    truncate curr_users;
    truncate dict_tags;
    truncate map_articles_tags;
    truncate map_favorites;
    truncate map_followers;
    SET FOREIGN_KEY_CHECKS=1;`,
      done,
    );
  });

  it('run tests with newman', (done) => {
    new TestApplication(AppModule, { path: 'api' }).getServer().then((server) => {
      expect.assertions(3);
      const port = 3456;

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
            delayRequest: 500,
          },
          (err, summary) => {
            expect(err).toBeFalsy();
            expect(summary.error).toBeFalsy();
            expect(summary.run.failures.length).toBe(0);
            server.close(done);
          },
        );
      });
    });
  }, 35000);
});
