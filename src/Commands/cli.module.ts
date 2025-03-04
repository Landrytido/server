import {Logger, Module} from '@nestjs/common';
import {ImportLegacyCommand} from "./importLegacy.command";
import {PrismaService} from "../Core/Datasource/Prisma";
import {ConfigModule, ConfigService} from "@nestjs/config";
import UseCaseFactory from "../Api/UseCase/UseCaseFactory";

@Module({
    imports: [
	  ConfigModule.forRoot({
		isGlobal: true,
	  }),
    ],
    providers: [
	  ConfigService,
	  PrismaService,
	  ImportLegacyCommand,
	  Logger,
	  UseCaseFactory,
    ],
})
export class CliModule {
}