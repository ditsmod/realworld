import * as http from 'http';
import { ControllerErrorHandler, Logger, LoggerConfig, RootModule } from '@ditsmod/core';
import { RouterModule } from '@ditsmod/router';

import { MysqlModule } from '@service/mysql/mysql.module';
import { ValidationModule } from '@service/validation/validation.module';
import { ErrorHandlerModule } from '@service/error-handler/error-handler.module';
import { UtilModule } from '@service/util/util.module';
import { BodyParserModule } from '@ditsmod/body-parser';
import { ConfigModule } from '@service/app-config/config.module';
import { MsgModule } from '@service/msg/msg.module';
import { AuthModule } from '@service/auth/auth.module';
import { openapiModuleWithParams } from '@service/openapi-with-params/openapi-with-params.module';
import { DemoModule } from '@routed/demo/demo.module';
import { AppLoggerModule } from '@service/logger/app-logger.module';

@RootModule({
  httpModule: http,
  serverName: 'Node.js',
  serverOptions: {},
  listenOptions: { port: 3000, host: 'localhost' },
  prefixPerApp: 'api',
  imports: [
    { prefix: 'demo', module: DemoModule },
    RouterModule,
    AuthModule,
    MysqlModule,
    openapiModuleWithParams,
    // AppLoggerModule, // Uncomment this to allow write logs with AppLoggerModule
    ConfigModule,
    MsgModule,
  ],
  controllers: [],
  resolvedCollisionsPerApp: [
    // [Logger, AppLoggerModule], // Uncomment this to allow write logs with AppLoggerModule
    // [LoggerConfig, AppLoggerModule], // Uncomment this to allow write logs with AppLoggerModule
  ],
  resolvedCollisionsPerReq: [[ControllerErrorHandler, ErrorHandlerModule]],
  exports: [
    AuthModule,
    openapiModuleWithParams,
    ValidationModule,
    ErrorHandlerModule,
    UtilModule,
    BodyParserModule,
  ],
})
export class AppModule {}
