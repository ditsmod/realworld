import { featureModule } from '@ditsmod/core';
import { CorsModule } from '@ditsmod/cors';
import { OasOptions } from '@ditsmod/openapi';

import { DbService } from './db.service';
import { ProfilesController } from './profiles.controller';

@featureModule({
  imports: [CorsModule],
  controllers: [ProfilesController],
  providersPerReq: [DbService],
  extensionsMeta: { oasOptions: { tags: ['profiles'] } as OasOptions },
})
export class ProfilesModule {}