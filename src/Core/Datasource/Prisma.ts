import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<any>('DATABASE_URL')
        }
      },
      log: [
        {
          emit: 'event',
          level: 'query'
        }
      ]
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    /*this.$on('query', async (e: any) => {
      // console.log(`${e.query} ${e.params}`);
    });
     */
  }

  async onModuleInit() {
    await this.$connect();
  }
}
