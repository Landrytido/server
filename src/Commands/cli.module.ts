import {Logger, Module} from '@nestjs/common';
import {ImportLegacyCommand} from "./importLegacy.command";
import {PrismaService} from "../Core/Datasource/Prisma";
import {ConfigService} from "@nestjs/config";
import UseCaseFactory from "../Api/UseCase/UseCaseFactory";

@Module({
    imports: [],
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