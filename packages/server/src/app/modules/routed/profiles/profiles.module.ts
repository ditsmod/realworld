import { CorsModule } from '@ditsmod/cors';
import { OasOptions } from '@ditsmod/openapi';
import { restModule } from '@ditsmod/rest';
import { TypeormModule } from '@ditsmod/typeorm';

import { User, Follower } from '#app/entities/index.js';
import { DbService } from './db.service.js';
import { ProfilesController } from './profiles.controller.js';

@restModule({
  imports: [CorsModule, TypeormModule.forFeature([User, Follower])],
  controllers: [ProfilesController],
  providersPerReq: [DbService],
  extensionsMeta: { oasOptions: { tags: ['profiles'] } as OasOptions },
})
export class ProfilesModule {}
