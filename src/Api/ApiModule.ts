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

import EventResolver from "./Resolver/EventResolver";
import EventRepository from "./Repository/EventRepository";
import SaveEventUseCase from "./UseCase/Event/SaveEventUseCase";
import { JwtModule } from "@nestjs/jwt";

import GetLoggedUserUseCase from "./UseCase/User/GetLoggedUser/GetLoggedUserUseCase";
import CommentRepository from "./Repository/CommentRepository";
import FileRepository from "./Repository/FileRepository";
import SaveFileUseCase from "./UseCase/File/SaveFile/SaveFileUseCase";

import { PuppeteerService } from "./UseCase/Link/Service/puppeteer.service";
import ConvertExternalInvitationUseCase from "./UseCase/Invitation/ConvertExternalInvitation/ConvertExternalInvitationUseCase";
import { AcceptLanguageResolver, I18nModule } from "nestjs-i18n";
import * as path from "path";
import GetExternalEmailByTokenUseCase from "./UseCase/Invitation/GetExternalEmailByToken/GetExternalEmailByTokenUseCase";
import { ScheduleModule } from "@nestjs/schedule";
import { Jobs } from "./Jobs/Jobs";
import { S3UploadService } from "./UseCase/Link/Service/s3-upload.service";
import { BullModule } from "@nestjs/bull";
import { ReminderProcessor } from "./Services/ReminderProcessor";
import { AutoInstructionGateway } from "./WebSocket/InstructionCardGateway";
import GoogleCalendarService from "./Services/GoogleCalendarService";
import LoggingModule from "../Core/Logging/LoggingModule";
import { ChronometerResolver } from "./Resolver/ChronometerResolver";
import { PrismaService } from "../Core/Datasource/Prisma";
import { StartChronometerUseCase } from "./UseCase/Chronometer/StartChronometerUseCase";
import { ChronometerRepository } from "./Repository/ChronometerRepository";
import { CheckCountdownStatusUseCase } from "./UseCase/Chronometer/CheckCountdownStatusUseCase";
import { DeleteChronometerUseCase } from "./UseCase/Chronometer/DeleteChronometerUseCase";
import { GetAllChronometersUseCase } from "./UseCase/Chronometer/GetAllChronometersUseCase";
import { GetChronometerUseCase } from "./UseCase/Chronometer/GetChronometerUseCase";
import { GetCountdownUseCase } from "./UseCase/Chronometer/GetCountdownUseCase";
import { GetCurrentTimeUseCase } from "./UseCase/Chronometer/GetCurrentTimeUseCase";
import { PauseChronometerUseCase } from "./UseCase/Chronometer/PauseChronometerUseCase";
import { ResetChronometerUseCase } from "./UseCase/Chronometer/ResetChronometerUseCase";
import { RenameChronometerUseCase } from "./UseCase/Chronometer/RenameChronometerUseCase";
import { ResumeChronometerUseCase } from "./UseCase/Chronometer/ResumeChronometerUseCase";
import { StopChronometerUseCase } from "./UseCase/Chronometer/StopChronometerUseCase";
import { UpdateChronometerUseCase } from "./UseCase/Chronometer/UpdateChronometerUseCase";

@Module({
  imports: [
    ConfigModule.forRoot(),
    CoreModule,
    EventEmitterModule.forRoot({ wildcard: true }),
    GraphqlModule,
    HttpModule,
    I18nModule.forRoot({
      fallbackLanguage: "fr",
      loaderOptions: {
        path: path.join(__dirname, "../../src/i18n"),
        watch: true,
        includeSubfolders: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
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
    JwtModule,
    ScheduleModule.forRoot(),
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
    CommentRepository,
    FileRepository,
    SaveFileUseCase,
    PuppeteerService,
    S3UploadService,
    ConvertExternalInvitationUseCase,
    GetExternalEmailByTokenUseCase,
    ...Repositories,
    ...Resolvers,
    ReminderProcessor,
    GoogleCalendarService,
    AutoInstructionGateway,
    ...Jobs,
    StartChronometerUseCase,
    StopChronometerUseCase,
    PauseChronometerUseCase,
    ResumeChronometerUseCase,
    ResetChronometerUseCase,
    DeleteChronometerUseCase,
    GetChronometerUseCase,
    GetAllChronometersUseCase,
    GetCountdownUseCase,
    CheckCountdownStatusUseCase,
    GetCurrentTimeUseCase,
    RenameChronometerUseCase,
    UpdateChronometerUseCase,
    ChronometerRepository,
    ChronometerResolver,
    PrismaService,
  ],

})
export class ApiModule {}
