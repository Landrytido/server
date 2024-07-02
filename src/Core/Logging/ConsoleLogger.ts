import { ConsoleLogger as NestConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export default class ConsoleLogger extends NestConsoleLogger {
  constructor(context: string) {
    super(context);
  }

  debug(message: any, data: any = {}, context?: string) {
    super.debug(message, context);

    if (process.env.APP_ENV !== 'local') {
      // FileLogger.debug(this.formatMessage(message, data, context), this.formatData(data, context));
    }
  }

  log(message: any, data: any = {}, context?: string) {
    super.log(message, typeof data === 'string' ? data : context);

    if (process.env.APP_ENV !== 'local') {
      // FileLogger.info(this.formatMessage(message, data, context), this.formatData(data, context));
    }
  }

  warn(message: any, data: any = {}, context?: string) {
    super.warn(message, context);
    // FileLogger.warn(this.formatMessage(message, data, context), this.formatData(data, context));
  }

  async error(message: any, data: any = {}, context?: string) {
    super.error(message, context);

    // FileLogger.error(this.formatMessage(message, data, context), this.formatData(data, context));
  }
}
