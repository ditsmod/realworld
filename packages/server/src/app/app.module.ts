import { BodyParserModule } from '@holu/body-parser';
import { Logger, LoggerConfig, ProviderBuilder } from '@holu/core';
import { CorsOptions } from '@holu/cors';
import { AJV_OPTIONS } from '@holu/openapi-validation';
import { HttpErrorHandler, restRootModule } from '@holu/rest';
import { I18nModule } from '@holu/i18n';
import { TypeormModule } from '@holu/typeorm';

import { ArticlesModule } from '#routed/articles/articles.module.js';
import { ProfilesModule } from '#routed/profiles/profiles.module.js';
import { TagsModule } from '#routed/tags/tags.module.js';
import { UsersModule } from '#routed/users/users.module.js';
import { ConfigModule } from '#service/app-config/config.module.js';
import { AuthModule } from '#service/auth/auth.module.js';
import { ErrorHandlerModule } from '#service/error-handler/error-handler.module.js';
import { LoggerModule } from '#service/logger/logger.module.js';
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
    TypeormModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT ? +process.env.MYSQL_PORT : 3306,
      username: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'realworld',
      synchronize: false,
    }),
    openapiModuleWithOpts,
    validationModuleWithOpts,
    ConfigModule,
    UtilModule,
    BodyParserModule,
    I18nModule,
    ErrorHandlerModule,
  ],
  exports: [
    AuthModule,
    openapiModuleWithOpts,
    validationModuleWithOpts,
    UtilModule,
    BodyParserModule,
    I18nModule,
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
