import { restModule } from '@holu/rest';
import { CorsModule } from '@holu/cors';
import { TypeormModule } from '@holu/typeorm';

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
