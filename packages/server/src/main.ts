import * as path from 'path';
import * as dotenv from 'dotenv';
import { Application } from '@ditsmod/core';

const dotenvPath = path.resolve(`${__dirname}/../.env`);
const output = dotenv.config({ path: dotenvPath });
if (output.error) {
  throw output.error;
}

// This import must go after setting dotenv.
import { AppModule } from './app/app.module';

new Application()
  .bootstrap(AppModule, { path: 'api' })
  .then((app) => {
    app.server.listen(3000, 'localhost');
  })
  .catch((err) => {
    console.log(err);
  });
