import {Module} from '@nestjs/common';
import {HelloCommand} from './hello.command';
import {ImportLegacyCommand} from "./importLegacy.command";
import UserRepository from "../Api/Repository/UserRepository";
import {ApiModule} from "../Api/ApiModule";

@Module({
    imports: [
	  ApiModule
    ],
    providers: [
	  ApiModule,
	  HelloCommand,
	  ImportLegacyCommand
    ],
})
export class CliModule {
}