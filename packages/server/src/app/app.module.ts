import { BodyParserModule } from '@ditsmod/body-parser';
import { HttpErrorHandler, Logger, Providers, rootModule } from '@ditsmod/core';
import { CorsOptions } from '@ditsmod/cors';

import { ArticlesModule } from '#routed/articles/articles.module.js';
import { ProfilesModule } from '#routed/profiles/profiles.module.js';
import { TagsModule } from '#routed/tags/tags.module.js';
import { UsersModule } from '#routed/users/users.module.js';
import { ConfigModule } from '#service/app-config/config.module.js';
import { AuthModule } from '#service/auth/auth.module.js';
import { ErrorHandlerModule } from '#service/error-handler/error-handler.module.js';
import { LoggerModule } from '#service/logger/logger.module.js';
import { MysqlModule } from '#service/mysql/mysql.module.js';
import { openapiModuleWithParams, validationModuleWithParams } from '#service/openapi-with-params/index.js';
import { UtilModule } from '#service/util/util.module.js';

@rootModule({
  appends: [
    UsersModule,
    { path: 'profiles', module: ProfilesModule },
    { path: 'articles/:slug', module: ArticlesModule },
    { path: 'tags', module: TagsModule },
  ],
  imports: [
    LoggerModule,
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
    AuthModule,
    openapiModuleWithParams,
    validationModuleWithParams,
    UtilModule,
    BodyParserModule,
    ErrorHandlerModule,
  ],
  resolvedCollisionsPerApp: [[Logger, LoggerModule]],
  resolvedCollisionsPerReq: [
    [HttpErrorHandler, ErrorHandlerModule],
  ],
  providersPerApp: new Providers()
    .useValue<CorsOptions>(CorsOptions, { origin: '*' })
    .useLogConfig({ level: 'info', showExternalLogs: false }),
})
export class AppModule {}
