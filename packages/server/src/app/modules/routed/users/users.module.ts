import { restModule } from '@ditsmod/rest';
import { CorsModule } from '@ditsmod/cors';
import { TypeormModule } from '@ditsmod/typeorm';

import { User } from '#app/entities/index.js';
import { DbService } from './db.service.js';
import { UsersController } from './users.controller.js';

@restModule({
  imports: [CorsModule, TypeormModule.forFeature([User])],
  controllers: [UsersController],
  providersPerReq: [DbService],
})
export class UsersModule {}
