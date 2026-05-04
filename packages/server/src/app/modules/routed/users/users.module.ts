import { restModule } from '@ditsmod/rest';
import { CorsModule } from '@ditsmod/cors';

import { DbService } from './db.service.js';
import { UsersController } from './users.controller.js';

@restModule({
  imports: [CorsModule],
  controllers: [UsersController],
  providersPerReq: [DbService],
})
export class UsersModule {}
