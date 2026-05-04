import { CorsModule } from '@ditsmod/cors';
import { OasOptions } from '@ditsmod/openapi';
import { restModule } from '@ditsmod/rest';

import { DbService } from './db.service.js';
import { ProfilesController } from './profiles.controller.js';

@restModule({
  imports: [CorsModule],
  controllers: [ProfilesController],
  providersPerReq: [DbService],
  extensionsMeta: { oasOptions: { tags: ['profiles'] } as OasOptions },
})
export class ProfilesModule {}