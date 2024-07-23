Object.assign(global, { WebSocket: require('ws') });
import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { json } from 'express';
import { ApiModule } from './Api/ApiModule';
import { ExceptionCatcher } from './Core/ExceptionCatcher';
import ConsoleLogger from './Core/Logging/ConsoleLogger';
import InitializationLogger from './Core/Logging/InitializationLogger';

/* @Bugfix it fixes issues with maxListeners due in ElasticSearch package */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('events').EventEmitter.defaultMaxListeners = 0;

export let app;

async function bootstrapApi() {
  app = await NestFactory.create(ApiModule, {
    logger: new InitializationLogger('NestFactory')
  });

  app.useLogger(app.get(ConsoleLogger));

  app.enableCors({ origin: '*' });
  app.use(graphqlUploadExpress({ maxFileSize: 15000000, maxFiles: 1 }));
  app.use(json({ limit: '1mb' }));

  app.useGlobalFilters(new ExceptionCatcher(app.get(ConsoleLogger)));

  await app.listen(process.env.API_PORT);
}

if (!process.env.APPLICATION_ENVIRONMENT) {
  bootstrapApi();
}
