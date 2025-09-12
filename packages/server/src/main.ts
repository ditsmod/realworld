console.time('cold start');
import { RestApplication } from '@ditsmod/rest';
import { AppModule } from './app/app.module.js';

const app = await RestApplication.create(AppModule, { path: 'api' });
app.server.listen(+process.env.WEBPORT!, process.env.WEBHOST, () => console.timeEnd('cold start'));