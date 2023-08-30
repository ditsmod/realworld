console.time('cold start');
import { Application } from '@ditsmod/core';
import { AppModule } from './app/app.module.js';

const app = await new Application().bootstrap(AppModule, { path: 'api' });
app.server.listen(3000, 'localhost', () => console.timeEnd('cold start'));