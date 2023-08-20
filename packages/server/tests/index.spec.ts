import * as path from 'path';
import * as dotenv from 'dotenv';

const dotenvPath = path.resolve(`${__dirname}/../.env`);
const output = dotenv.config({ path: dotenvPath });
if (output.error) {
  throw output.error;
}

// This imports must go after setting dotenv.
import { TestApplication } from '@ditsmod/testing';
import * as newman from 'newman';

import { AppModule } from '../src/app/app.module';

describe('postman tests', () => {
  it('run tests from shell', (done) => {
    new TestApplication(AppModule, { path: 'api' }).getServer().then((server) => {
      expect.assertions(3);
      const port = 3456;

      server.listen(port, 'localhost', () => {
        newman.run(
          {
            collection: require('./conduit.postman-collection.json'),
            reporters: 'cli',
            envVar: [
              { key: 'APIURL', value: `http://localhost:${port}/api` },
              { key: 'EMAIL', value: 'any-email@gmail.com' },
              { key: 'USERNAME', value: 'any-username' },
              { key: 'PASSWORD', value: 'any-password' },
            ],
            delayRequest: 50,
          },
          (err, summary) => {
            server.close(done);
            expect(err).toBeFalsy();
            expect(summary.error).toBeFalsy();
            expect(summary.run.failures.length).toBe(0);
            console.log('*'.repeat(80), 'done!');
          },
        );
      });

    });
  }, 10000);
});
