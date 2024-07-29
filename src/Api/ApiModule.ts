import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { S3Module } from 'nestjs-s3';
import CoreModule from '../Core/CoreModule';
import GraphqlModule from '../Core/GraphqlModule';
import {Repositories} from "./Repository/Repositories";
import {Resolvers} from "./Resolver/Resolvers";
import UseCaseFactory from "./UseCase/UseCaseFactory";
import UncontextualUseCaseFactory from "./UseCase/UncontextualUseCaseFactory";
import MeetResolver from './Resolver/MeetResolver';
import CreateMeetUseCase from './UseCase/Meet/CreateMeetUseCase';
import MeetRepository from './Repository/MeetRepository';
import UpdateMeetUseCase from './UseCase/Meet/UpdateMeetUseCase';
import GetMeetUseCase from './UseCase/Meet/GetMeetUseCase';
import DeleteMeetUseCase from './UseCase/Meet/DeleteMeetUseCase';
import GetAllMeetUseCase from './UseCase/Meet/GetAllMeetUseCase';


@Module({
  imports: [
    ConfigModule.forRoot(),
    CoreModule,
    EventEmitterModule.forRoot({ wildcard: true }),
    GraphqlModule,
    HttpModule,
    S3Module.forRoot({
      config: {
        credentials: {
          accessKeyId: process.env.CDN_ACCESS_KEY_ID,
          secretAccessKey: process.env.CDN_ACCESS_KEY,
        },
        endpoint: process.env.CDN_PUBLIC_URL,
        forcePathStyle: true
      }
    }),
  ],
  controllers: [],
  providers: [
    UseCaseFactory,
    UncontextualUseCaseFactory,
    MeetResolver,
    UpdateMeetUseCase,
    CreateMeetUseCase,
    MeetRepository,
    GetMeetUseCase,
    GetAllMeetUseCase,
    DeleteMeetUseCase,
    ...Repositories,
    ...Resolvers
  ]
})
export class ApiModule {}
