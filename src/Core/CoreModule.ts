import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import DatasourceModule from './Datasource/DatasourceModule';
import EventModule from './Event/EventModule';
import DateFactory from './Factory/DateFactory';
import PromiseFactory from './Factory/PromiseFactory';
import IbanValidator from './Helper/IbanValidator';
import NumberFormatter from './Helper/NumberFormatter';
import TextHelper from './Helper/TextHelper';
import UniqidGenerator from './Helper/UniqidGenerator';
import LoggingModule from './Logging/LoggingModule';
import SecurityModule from './Security/SecurityModule';

@Module({
  imports: [ ConfigModule, DatasourceModule, EventModule, LoggingModule, SecurityModule ],
  exports: [
    ConfigModule,
    DatasourceModule,
    DateFactory,
    EventModule,
    IbanValidator,
    LoggingModule,
    NumberFormatter,
    PromiseFactory,
    TextHelper,
    SecurityModule,
    UniqidGenerator
  ],
  controllers: [],
  providers: [
    DateFactory,
    IbanValidator,
    NumberFormatter,
    PromiseFactory,
    TextHelper,
    UniqidGenerator
  ]
})
export default class CoreModule {}
