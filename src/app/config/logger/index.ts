import Bunyan from 'bunyan';
import Path from 'path';

let logger = null;
const appName = 'flight-booking-system';

/**
 * Express logger config.
 */

export const expressLoggerConfig = {
  name: appName,
  streams: [
    {
      level: 'info',
      obfuscate: [
        'body.password', // all passwords
      ],
      path: Path.resolve(__dirname, `../../../../logs/${appName}-logs-info.log`),
      period: '3d',
      count: 3,
    },
  ],
};

/**
 * Generates a Bunyan logger service.
 * Will be called during server initialization.
 */

export const initLoggerService = () => {
  logger = Bunyan.createLogger({
    name: appName,
    streams: [
      {
        level: 'debug',
        stream: process.stdout,
      }, {
        level: 'info',
        path: Path.resolve(__dirname, `../../../../logs/${appName}-logs-info.log`),
      }, {
        level: 'warn',
        path: Path.resolve(__dirname, `../../../../logs/${appName}-logs-warn.log`),
      }, {
        level: 'error',
        path: Path.resolve(__dirname, `../../../../logs/${appName}-logs-error.log`),
      }, {
        level: 'fatal',
        path: Path.resolve(__dirname, `../../../../logs/${appName}-logs-fatal.log`),
      },
    ],
  });
  
};


export const getLogger = () => logger;
