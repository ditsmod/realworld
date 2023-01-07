import * as path from 'path';
import * as fs from 'fs';
import { NodeResponse } from '@ditsmod/core';
import BunyanLogger, { LoggerOptions } from 'bunyan';
import { NodeRequest } from '@ts-stack/cookies';

let logsDir: string = process.env.LOGS_DIR || '';

if (!logsDir) {
  logsDir = path.resolve(`${__dirname}/../../../../../logs`);
  if (!fs.existsSync(logsDir)) {
    throw new Error('You must set LOGS_DIR in "packages/server/.env"');
  }
}

export const loggerOptions: LoggerOptions = {
  name: 'logger-1',
  serializers: {
    err: BunyanLogger.stdSerializers.err,
    req: (nodeReq: NodeRequest) => {
      if (!nodeReq?.socket) {
        return nodeReq;
      }

      return {
        method: nodeReq.method,
        url: nodeReq.url,
        headers: nodeReq.headers,
        remoteAddress: nodeReq.socket.remoteAddress,
        remotePort: nodeReq.socket.remotePort,
      };
    },
    res: (nodeRes: NodeResponse) => {
      if (!nodeRes.statusCode) {
        return nodeRes;
      }

      return {
        statusCode: nodeRes.statusCode,
        header: nodeRes.getHeaders(),
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
