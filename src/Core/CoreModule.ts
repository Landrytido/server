import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import DatasourceModule from "./Datasource/DatasourceModule";
import EventModule from "./Event/EventModule";
import DateFactory from "./Factory/DateFactory";
import PromiseFactory from "./Factory/PromiseFactory";
import IbanValidator from "./Helper/IbanValidator";
import NumberFormatter from "./Helper/NumberFormatter";
import TextHelper from "./Helper/TextHelper";
import UniqidGenerator from "./Helper/UniqidGenerator";
import LoggingModule from "./Logging/LoggingModule";
import SecurityModule from "./Security/SecurityModule";
import {PrismaService} from "./Datasource/Prisma";
import Mailer from "./Mailing/Mailer";
import MailMustacheRenderer from "./Mailing/MailMustacheRenderer";
import UserRepository from "src/Api/Repository/UserRepository";
import {NotificationModule} from "./Notification/notification.module";
import {PrismaSeedService} from "./Seeder/prisma-seed.service";

@Module({
    imports: [
	  ConfigModule,
	  DatasourceModule,
	  EventModule,
	  LoggingModule,
	  SecurityModule,
	  NotificationModule,
    ],
    exports: [
	  ConfigModule,
	  DatasourceModule,
	  DateFactory,
	  EventModule,
	  IbanValidator,
	  LoggingModule,
	  Mailer,
	  MailMustacheRenderer,
	  NumberFormatter,
	  PromiseFactory,
	  TextHelper,
	  SecurityModule,
	  UniqidGenerator,
	  UserRepository, //ajout
	  PrismaService,
    ],
    controllers: [],
    providers: [
	  DateFactory,
	  IbanValidator,
	  Mailer,
	  MailMustacheRenderer,
	  NumberFormatter,
	  PromiseFactory,
	  TextHelper,
	  UniqidGenerator,
	  UserRepository, //ajout
	  PrismaService,
	  PrismaSeedService
    ],
})
export default class CoreModule {
}
