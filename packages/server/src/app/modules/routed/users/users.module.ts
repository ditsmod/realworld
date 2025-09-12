import { initRest } from '@ditsmod/rest';
import { featureModule } from '@ditsmod/core';
import { CorsModule } from '@ditsmod/cors';

import { DbService } from './db.service.js';
import { UsersController } from './users.controller.js';

@initRest({
  imports: [CorsModule],
  controllers: [UsersController],
  providersPerReq: [DbService],
})
@featureModule()
export class UsersModule {}
