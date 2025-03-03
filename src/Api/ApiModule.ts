import {HttpModule} from "@nestjs/axios";
import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {S3Module} from "nestjs-s3";
import CoreModule from "../Core/CoreModule";
import GraphqlModule from "../Core/GraphqlModule";
import {Repositories} from "./Repository/Repositories";
import {Resolvers} from "./Resolver/Resolvers";
import UseCaseFactory from "./UseCase/UseCaseFactory";
import UncontextualUseCaseFactory from "./UseCase/UncontextualUseCaseFactory";
import {JwtModule} from "@nestjs/jwt";
import GetLoggedUserUseCase from "./UseCase/User/GetLoggedUser/GetLoggedUserUseCase";
import CommentRepository from "./Repository/CommentRepository";
import FileRepository from "./Repository/FileRepository";
import SaveFileUseCase from "./UseCase/File/SaveFile/SaveFileUseCase";
import ConvertExternalInvitationUseCase
    from "./UseCase/Invitation/ConvertExternalInvitation/ConvertExternalInvitationUseCase";
import {AcceptLanguageResolver, I18nModule} from "nestjs-i18n";
import * as path from "path";
import GetExternalEmailByTokenUseCase
    from "./UseCase/Invitation/GetExternalEmailByToken/GetExternalEmailByTokenUseCase";
import {ScheduleModule} from "@nestjs/schedule";
import {Jobs} from "./Jobs/Jobs";
import {ReminderProcessor} from "./Services/ReminderProcessor";
import {AutoInstructionGateway} from "./WebSocket/InstructionCardGateway";
import GoogleCalendarService from "./Services/GoogleCalendarService";
import {CalendarEventNotificationService} from "./Services/CalendarEventNotificationService";
import {NotificationModule} from "../Core/Notification/notification.module";
import {PuppeteerService} from "./Services/PupeteerService";
import {S3UploadService} from "./Services/S3UploadService";

@Module({
    imports: [
	  ConfigModule.forRoot(),
	  CoreModule,
	  EventEmitterModule.forRoot({wildcard: true}),
	  GraphqlModule,
	  HttpModule,
	  NotificationModule,
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
	  CalendarEventNotificationService,
	  AutoInstructionGateway,
	  ...Jobs,
    ],
})
export class ApiModule {
}
