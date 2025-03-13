import { CommandFactory } from 'nest-commander';
import {CliModule} from "./Commands/cli.module";

async function bootstrap() {
    await CommandFactory.run(CliModule, ['warn', 'error']);
}

bootstrap();