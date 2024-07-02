import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import ConsoleLogger from './ConsoleLogger';

@Module({
  imports: [ ConfigModule ],
  exports: [ ConsoleLogger, Logger ],
  providers: [ ConsoleLogger, Logger ]
})
export default class LoggingModule {}
