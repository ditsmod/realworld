import { featureModule } from '@ditsmod/core';
import { CorsModule } from '@ditsmod/cors';

import { DbService } from './db.service';
import { UsersController } from './users.controller';

@featureModule({
  imports: [CorsModule],
  controllers: [UsersController],
  providersPerReq: [DbService],
})
export class UsersModule {}
