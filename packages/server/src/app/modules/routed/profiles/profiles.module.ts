import { CorsModule } from '@holu/cors';
import { OasOptions } from '@holu/openapi';
import { restModule } from '@holu/rest';
import { TypeormModule } from '@holu/typeorm';

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
