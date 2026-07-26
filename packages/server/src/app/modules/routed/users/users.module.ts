import { restModule } from '@ditsmod/rest';
import { CorsModule } from '@ditsmod/cors';
import { TypeormModule } from '@ditsmod/typeorm';

import { UserEntity } from '#entities';
import { DbService } from './db.service.js';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

@restModule({
  imports: [CorsModule, TypeormModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providersPerReq: [DbService, UsersService],
})
export class UsersModule {}
