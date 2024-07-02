import { Module } from '@nestjs/common';
import DatasourceModule from '../Datasource/DatasourceModule';
import LoggingModule from '../Logging/LoggingModule';
import RequestEventEmitter from './Emitter/RequestEventEmitter';

@Module({
  imports: [ DatasourceModule, LoggingModule ],
  exports: [ RequestEventEmitter ],
  providers: [
    RequestEventEmitter,
  ]
})
export default class EventModule {}
