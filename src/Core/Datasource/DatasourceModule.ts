import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import LoggingModule from '../Logging/LoggingModule';
import { PrismaService } from './Prisma';

@Module({
  imports: [
    ConfigModule,
    LoggingModule
  ],
  exports: [ PrismaService ],
  providers: [ PrismaService, ]
})
export default class DatasourceModule {}
