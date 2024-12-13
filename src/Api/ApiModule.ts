import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { S3Module } from "nestjs-s3";
import CoreModule from "../Core/CoreModule";
import GraphqlModule from "../Core/GraphqlModule";
import { Repositories } from "./Repository/Repositories";
import { Resolvers } from "./Resolver/Resolvers";
import UseCaseFactory from "./UseCase/UseCaseFactory";
import UncontextualUseCaseFactory from "./UseCase/UncontextualUseCaseFactory";
import EventResolver from './Resolver/EventResolver';
import EventRepository from './Repository/EventRepository';
import GetEventUseCase from './UseCase/Event/GetEventUseCase';
import DeleteEventUseCase from './UseCase/Event/DeleteEventUseCase';
import GetAllEventUseCase from './UseCase/Event/GetAllEventUseCase';
import SaveEventUseCase from './UseCase/Event/SaveEventUseCase';
import { JwtModule } from "@nestjs/jwt";
import GetLoggedUserUseCase from "./UseCase/User/GetLoggedUser/GetLoggedUserUseCase";
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
        forcePathStyle: true,
      },
    }),
    JwtModule
  ],
  controllers: [],
  providers: [
    UseCaseFactory,
    UncontextualUseCaseFactory,
    EventResolver,
    SaveEventUseCase,
    EventRepository,
    GetEventUseCase,
    GetAllEventUseCase,
    DeleteEventUseCase,
    GetLoggedUserUseCase,
    ...Repositories,
    ...Resolvers,
  ],
})
export class ApiModule {}
