import * as path from 'path';
import * as fs from 'fs';
import { Req, Res } from '@ditsmod/core';
import { LoggerOptions, Logger as BunyanLogger } from '@ditsmod/logger';

let logsDir: string = process.env.LOGS_DIR || '';

if (!logsDir) {
  logsDir = path.resolve(`${__dirname}/../../../../../logs`);
  if (!fs.existsSync(logsDir)) {
    throw new Error('You must set LOGS_DIR in "packages/server/.env"');
  }
}

export const loggerOptions: LoggerOptions = {
  name: 'demo-logger-1',
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
