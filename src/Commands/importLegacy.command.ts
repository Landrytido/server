import { Command, CommandRunner, Option } from 'nest-commander';
import UserRepository from "../Api/Repository/UserRepository";
import {PrismaService} from "../Core/Datasource/Prisma";

interface BasicCommandOptions {
    string?: string;
    boolean?: boolean;
    number?: number;
    email?: string;
}

@Command({
    name: 'importLegacy',
    description: 'Import the legacy data from the previous MWC Angular app',
})
export class ImportLegacyCommand extends CommandRunner {
    constructor(
	    private readonly prisma: PrismaService,
    ) {
	  super();
    }

    async run(
	    passedParam: string[],
	    options?: BasicCommandOptions,
    ): Promise<void> {
	  console.log('Email:', options?.email);
	  const existingUser = await this.prisma.user.findUnique(
		  	      {
		  where: {
		      email: options?.email,
		  },
	      },
	  )
	  console.log(existingUser)
    }

    @Option({
	  flags: '-e, --email <email>',
	  description: 'User email address',
    })
    parseEmail(val: string): string {
	  return val;
    }
}
