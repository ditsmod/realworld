import * as http from 'http';
import { ControllerErrorHandler, Logger, LoggerConfig, Providers, RootModule } from '@ditsmod/core';
import { RouterModule } from '@ditsmod/router';
import BunyanLogger, { createLogger } from 'bunyan';

import { MysqlModule } from '@service/mysql/mysql.module';
import { ValidationModule } from '@service/validation/validation.module';
import { ErrorHandlerModule } from '@service/error-handler/error-handler.module';
import { UtilModule } from '@service/util/util.module';
import { BodyParserModule } from '@ditsmod/body-parser';
import { ConfigModule } from '@service/app-config/config.module';
import { MsgModule } from '@service/msg/msg.module';
import { AuthModule } from '@service/auth/auth.module';
import { openapiModuleWithParams } from '@service/openapi-with-params/openapi-with-params.module';
import { UsersModule } from '@routed/users/users.module';
import { ProfilesModule } from '@routed/profiles/profiles.module';
import { ArticlesModule } from '@routed/articles/articles.module';
import { TagsModule } from '@routed/tags/tags.module';
import { loggerOptions, patchLogger } from '@configs/logger-options';

const logger = createLogger(loggerOptions);

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
    ConfigModule,
    MsgModule,
    ValidationModule,
    ErrorHandlerModule,
    UtilModule,
    BodyParserModule,
  ],
  controllers: [],
  providersPerApp: [
    { provide: BunyanLogger, useExisting: Logger },
    ...new Providers()
    .useValue(LoggerConfig, { level: 'info' })
    // .useLogger(logger, { level: 'info' }) // Uncomment this to allow write to packages/server/logs
  ],
  resolvedCollisionsPerReq: [[ControllerErrorHandler, ErrorHandlerModule]],
  exports: [AuthModule, openapiModuleWithParams, ValidationModule, ErrorHandlerModule, UtilModule, BodyParserModule],
})
export class AppModule {
  constructor(config: LoggerConfig) {
    patchLogger(logger, config);
  }
}
