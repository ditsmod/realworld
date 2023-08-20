import { BodyParserModule } from '@ditsmod/body-parser';
import { HttpErrorHandler, HttpBackend, Logger, Providers, rootModule } from '@ditsmod/core';
import { CorsOpts } from '@ditsmod/cors';
import { ReturnModule } from '@ditsmod/return';
import { RouterModule } from '@ditsmod/router';

import { ArticlesModule } from '@routed/articles/articles.module';
import { ProfilesModule } from '@routed/profiles/profiles.module';
import { TagsModule } from '@routed/tags/tags.module';
import { UsersModule } from '@routed/users/users.module';
import { ConfigModule } from '@service/app-config/config.module';
import { AuthModule } from '@service/auth/auth.module';
import { ErrorHandlerModule } from '@service/error-handler/error-handler.module';
import { LoggerModule } from '@service/logger/logger.module';
import { MysqlModule } from '@service/mysql/mysql.module';
import { openapiModuleWithParams, validationModuleWithParams } from '@service/openapi-with-params';
import { UtilModule } from '@service/util/util.module';

@rootModule({
  appends: [
    UsersModule,
    { path: 'profiles', module: ProfilesModule },
    { path: 'articles/:slug', module: ArticlesModule },
    { path: 'tags', module: TagsModule },
  ],
  imports: [
    ReturnModule,
    LoggerModule,
    RouterModule,
    AuthModule,
    MysqlModule,
    openapiModuleWithParams,
    validationModuleWithParams,
    ConfigModule,
    UtilModule,
    BodyParserModule,
    ErrorHandlerModule,
  ],
  exports: [
    ReturnModule,
    AuthModule,
    openapiModuleWithParams,
    validationModuleWithParams,
    UtilModule,
    BodyParserModule,
    ErrorHandlerModule,
  ],
  resolvedCollisionsPerApp: [
    [Logger, LoggerModule]
  ],
  resolvedCollisionsPerReq: [
    [HttpErrorHandler, ErrorHandlerModule],
    [HttpBackend, ReturnModule]
  ],
  providersPerApp: [
    ...new Providers()
      .useValue<CorsOpts>(CorsOpts, { origin: '*' })
      .useLogConfig({ level: 'info' })
  ],
})
export class AppModule {}
