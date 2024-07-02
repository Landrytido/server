import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import * as stringify from 'json-stringify-safe';
import ConsoleLogger from './Logging/ConsoleLogger';

@Catch()
export class ExceptionCatcher extends BaseExceptionFilter {
  constructor(private readonly logger: ConsoleLogger) {
    super();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    if (
      'message' in (exception as any)
      && 'type' in (exception as any)
      && 'code' in (exception as any)
      && (exception as any).code === 'ECONNABORTED'
    ) {
      this.logger.warn((exception as any).message, { caught: stringify({ exception, host }) }, 'ExceptionCatcher');

      return;
    }

    if ('message' in (exception as any)) {
      // eslint-disable-next-line max-len
      void this.logger.warn((exception as any).message, {}, `ExceptionCatcher::${(exception as Error).name}`);

      return;
    }

    super.catch(exception, host);
  }
}
