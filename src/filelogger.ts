import * as winston from 'winston';

export const FileLogger = winston.createLogger({
  level: 'debug',
  format: null,
  transports: [
    new winston.transports.File({
      filename: `logs/${process.env.APPLICATION_ENVIRONMENT ?? 'api'}.json`,
      level: 'debug'
    })
  ]
});

[ 'SIGTERM', 'SIGINT', 'SIGHUP' ].forEach(signalName =>
  process.on(signalName, signal => {
    // FileLogger.debug(`Retrieved signal: ${signal}, application terminated`, {});
    process.exit(0);
  })
);

process.on('uncaughtException', (error: Error) => {
  // FileLogger.error({ err: error });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  // FileLogger.error(`Unhandled Promise Rejection, reason: ${reason}`);

  promise.catch((err: Error) => {
    // FileLogger.error({ err });
    process.exit(1);
  });
});
