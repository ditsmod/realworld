import * as http from 'http';
import { ControllerErrorHandler, Logger, LoggerConfig, Providers, RootModule, Status } from '@ditsmod/core';
import { RouterModule } from '@ditsmod/router';
import { BodyParserModule } from '@ditsmod/body-parser';
import BunyanLogger from 'bunyan';
import { Options } from 'ajv';
import { AJV_OPTIONS, ValidationOptions } from '@ditsmod/openapi-validation';

import { MysqlModule } from '@service/mysql/mysql.module';
import { UtilModule } from '@service/util/util.module';
import { ConfigModule } from '@service/app-config/config.module';
import { AuthModule } from '@service/auth/auth.module';
import { openapiModuleWithParams, validationModuleWithParams } from '@service/openapi-with-params';
import { UsersModule } from '@routed/users/users.module';
import { ProfilesModule } from '@routed/profiles/profiles.module';
import { ArticlesModule } from '@routed/articles/articles.module';
import { TagsModule } from '@routed/tags/tags.module';
import { patchLogger } from '@configs/logger-options';
import { ErrorHandlerModule } from '@service/error-handler/error-handler.module';

@RootModule({
  httpModule: http,
  serverName: 'Node.js',
  serverOptions: {},
  listenOptions: { port: 3000, host: 'localhost' },
  path: 'api',
  imports: [
    { path: '', module: UsersModule },
    { path: 'profiles', module: ProfilesModule },
    { path: 'articles/:slug', module: ArticlesModule },
    { path: 'tags', module: TagsModule },
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
    AuthModule,
    openapiModuleWithParams,
    validationModuleWithParams,
    UtilModule,
    BodyParserModule,
    ErrorHandlerModule,
  ],
  resolvedCollisionsPerReq: [
    [ControllerErrorHandler, ErrorHandlerModule]
  ],
  providersPerApp: [
    { provide: BunyanLogger, useExisting: Logger },
    ...new Providers()
      .useValue<ValidationOptions>(ValidationOptions, { invalidStatus: Status.UNPROCESSABLE_ENTRY })
      .useValue<Options>(AJV_OPTIONS, { allErrors: true })
      .useLogConfig({ level: 'info' })
      // .useFactory(Logger, patchLogger, [LoggerConfig])// Uncomment this to allow write logs to packages/server/logs
  ],
})
export class AppModule {}
