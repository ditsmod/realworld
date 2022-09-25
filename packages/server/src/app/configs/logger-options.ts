import * as path from 'path';
import * as fs from 'fs';
import { Logger, LoggerConfig, LogLevel, Req, Res } from '@ditsmod/core';
import BunyanLogger, { LoggerOptions } from 'bunyan';

let logsDir: string = process.env.LOGS_DIR || '';

if (!logsDir) {
  logsDir = path.resolve(`${__dirname}/../../../logs`);
  if (!fs.existsSync(logsDir)) {
    throw new Error('You must set LOGS_DIR in "packages/server/.env"');
  }
}

export function patchLogger(logger: BunyanLogger, config: LoggerConfig) {

  logger.level(config.level);

  // Logger must have `log` method.
  (logger as unknown as Logger).log = (level: LogLevel, ...args: any[]) => {
    const [arg1, ...rest] = args;
    logger[level](arg1, ...rest);
  };

  // Logger must have `setLevel` method.
  (logger as unknown as Logger).setLevel = (value: LogLevel) => {
    logger.level(value);
  };

  // Logger must have `getLevel` method.
  (logger as unknown as Logger).getLevel = () => {
    const bunyanLevels: { level: number; name: LogLevel }[] = [
      { level: 10, name: 'trace' },
      { level: 20, name: 'debug' },
      { level: 30, name: 'info' },
      { level: 40, name: 'warn' },
      { level: 50, name: 'error' },
      { level: 60, name: 'fatal' },
    ];
    const levelNumber = logger.level();
    const levelName = bunyanLevels.find((i) => i.level == levelNumber)?.name || config.level;
    return levelName;
  };

}

export const loggerOptions: LoggerOptions = {
  name: 'logger-1',
  serializers: {
    err: BunyanLogger.stdSerializers.err,
    req: (req: Req) => {
      if (!req?.nodeReq?.socket) {
        return req;
      }

      return {
        method: req.nodeReq.method,
        url: req.nodeReq.url,
        headers: req.nodeReq.headers,
        remoteAddress: req.nodeReq.socket.remoteAddress,
        remotePort: req.nodeReq.socket.remotePort,
      };
    },
    res: (res: Res) => {
      if (!res?.nodeRes.statusCode) {
        return res;
      }

      return {
        statusCode: res.nodeRes.statusCode,
        header: res.nodeRes.getHeaders(),
      };
    },
  },
  streams: [
    {
      level: 'info',
      path: `${logsDir}/20-info.log`,
    },
  ],
  src: false, // process.env.NODE_ENV != 'prod'
  v: 0,
};