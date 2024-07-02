import { ConsoleLogger, Injectable } from '@nestjs/common';
import { FileLogger } from '../../filelogger';

@Injectable()
export default class InitializationLogger extends ConsoleLogger {
  constructor(context: string) {
    super(context);
  }

  debug(message: any, context?: string) {
    super.debug(message, context);

    if (process.env.APP_ENV !== 'local') {
      // FileLogger.debug(message);
    }
  }

  log(message: any, context?: string) {
    super.log(message, context);

    if (process.env.APP_ENV !== 'local') {
      // FileLogger.info(message);
    }
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
    // FileLogger.warn(message);
  }

  error(message: any, context?: string) {
    super.error(message, context);
    // FileLogger.error(message);
  }
}
