Object.assign(global, { WebSocket: require("ws") });
import { NestFactory } from "@nestjs/core";
import { graphqlUploadExpress } from "graphql-upload";
import { json } from "express";
import { ApiModule } from "./Api/ApiModule";
import { ExceptionCatcher } from "./Core/ExceptionCatcher";
import ConsoleLogger from "./Core/Logging/ConsoleLogger";
import InitializationLogger from "./Core/Logging/InitializationLogger";
import { registerEnumType } from "@nestjs/graphql";
import {
  Level,
  Recurrence,
  CalendarEventType,
  PermissionLevel,
  TimeUnit,
  InvitationStatus,
  NotificationType, Platform
} from '@prisma/client';

registerEnumType(Level, {
  name: "Level",
  description: "Possible Level options: EASY, MEDIUM, HARD",
});

registerEnumType(NotificationType, {
  name: "NotificationType",
  description: "Possible NotificationType options: EMAIL, PUSH",
});

registerEnumType(TimeUnit, {
  name: "TimeUnit",
  description: "Possible TimeUnit options : MINUTES, HOURS, DAYS",
});
registerEnumType(Recurrence, {
  name: "Recurrence",
  description:
    "Possible recurrence options: NONE, DAILY, WEEKLY, MONTHLY, ANNUAL",
});
registerEnumType(CalendarEventType, {
  name: "CalendarEventType",
  description: "Possible CalendarEventType options: TASK, EVENT",
});
registerEnumType(Platform, {
  name: 'Platform',
  description: 'Possible Platform options: WEB, MOBILE',
});
registerEnumType(PermissionLevel, {
  name: "PermissionLevel",
  description: "Possible PermissionLevel options : READ, WRITE, ADMIN",
});
registerEnumType(InvitationStatus, {
  name: "InvitationStatus",
  description: "Possible InvitationStatus options: PENDING, ACCEPTED, REFUSED",
});

require("events").EventEmitter.defaultMaxListeners = 0;

export let app;

async function bootstrapApi() {
  app = await NestFactory.create(ApiModule, {
    logger: new InitializationLogger("NestFactory"),
  });

  app.useLogger(app.get(ConsoleLogger));

  //app.enableCors({ origin: "*" });
  app.enableCors({
    origin: "*",
    methods: ["GET", "POST"],
  });
  app.use(graphqlUploadExpress({ maxFileSize: 15000000, maxFiles: 1 }));
  app.use(json({ limit: "1mb" }));

  app.useGlobalFilters(new ExceptionCatcher(app.get(ConsoleLogger)));

  await app.listen(process.env.API_PORT);
}

if (!process.env.APPLICATION_ENVIRONMENT) {
  bootstrapApi();
}
