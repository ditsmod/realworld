import { BodyParserModule } from '@ditsmod/body-parser';
import { Logger, LoggerConfig, ProviderBuilder } from '@ditsmod/core';
import { CorsOptions } from '@ditsmod/cors';
import { AJV_OPTIONS } from '@ditsmod/openapi-validation';
import { HttpErrorHandler, restRootModule } from '@ditsmod/rest';

import { ArticlesModule } from '#routed/articles/articles.module.js';
import { ProfilesModule } from '#routed/profiles/profiles.module.js';
import { TagsModule } from '#routed/tags/tags.module.js';
import { UsersModule } from '#routed/users/users.module.js';
import { ConfigModule } from '#service/app-config/config.module.js';
import { AuthModule } from '#service/auth/auth.module.js';
import { ErrorHandlerModule } from '#service/error-handler/error-handler.module.js';
import { LoggerModule } from '#service/logger/logger.module.js';
import { MysqlModule } from '#service/mysql/mysql.module.js';
import { openapiModuleWithOpts, validationModuleWithOpts } from '#service/openapi-with-params/index.js';
import { UtilModule } from '#service/util/util.module.js';

@restRootModule({
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
    openapiModuleWithOpts,
    validationModuleWithOpts,
    ConfigModule,
    UtilModule,
    BodyParserModule,
    ErrorHandlerModule,
  ],
  exports: [
    AuthModule,
    openapiModuleWithOpts,
    validationModuleWithOpts,
    UtilModule,
    BodyParserModule,
    ErrorHandlerModule,
  ],

  resolvedCollisionsPerApp: [
    [Logger, LoggerModule],
    [AJV_OPTIONS, validationModuleWithOpts],
  ],
  resolvedCollisionsPerReq: [[HttpErrorHandler, ErrorHandlerModule]],
  providersPerApp: new ProviderBuilder()
    .useValue<CorsOptions>(CorsOptions, { origin: '*' })
    .useValue(LoggerConfig, { level: 'info', showExternalLogs: false }),
})
export class AppModule {}
