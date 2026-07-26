import { CorsModule } from '@ditsmod/cors';
import { OasOptions } from '@ditsmod/openapi';
import { restModule } from '@ditsmod/rest';
import { TypeormModule } from '@ditsmod/typeorm';

import { UserEntity, FollowerEntity } from '#entities';
import { DbService } from './db.service.js';
import { ProfilesController } from './profiles.controller.js';
import { ProfilesService } from './profiles.service.js';

@restModule({
  imports: [CorsModule, TypeormModule.forFeature([UserEntity, FollowerEntity])],
  controllers: [ProfilesController],
  providersPerReq: [DbService, ProfilesService],
  extensionsMeta: { oasOptions: { tags: ['profiles'] } as OasOptions },
})
export class ProfilesModule {}
