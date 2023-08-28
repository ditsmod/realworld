import { featureModule } from '@ditsmod/core';
import { CorsModule } from '@ditsmod/cors';

import { DbService } from './db.service.js';
import { UsersController } from './users.controller.js';

@featureModule({
  imports: [CorsModule],
  controllers: [UsersController],
  providersPerReq: [DbService],
})
export class UsersModule {}
