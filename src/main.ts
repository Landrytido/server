Object.assign(global, { WebSocket: require("ws") });
import { NestFactory } from "@nestjs/core";
import { graphqlUploadExpress } from "graphql-upload";
import { json } from "express";
import { ApiModule } from "./Api/ApiModule";
import { ExceptionCatcher } from "./Core/ExceptionCatcher";
import ConsoleLogger from "./Core/Logging/ConsoleLogger";
import InitializationLogger from "./Core/Logging/InitializationLogger";
import { registerEnumType } from "@nestjs/graphql";
import { Level } from "@prisma/client";

export enum Recurrence {
  NONE = "NONE",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  ANNUAL = "ANNUAL",
}

export enum PermissionLevel {
  READ = "READ",
  WRITE = "WRITE",
  ADMIN = "ADMIN",
}

export enum NotificationType {
  EMAIL = "EMAIL",
  PUSH = "PUSH",
}

export enum TimeUnit {
  MINUTES = "MINUTES",
  HOURS = "HOURS",
  DAYS = "DAYS",
}

registerEnumType(Level, {
  name: "Level",
  description: "Level of difficulty for the score (easy, medium, hard)",
});

registerEnumType(NotificationType, { name: "NotificationType" });

registerEnumType(TimeUnit, { name: "TimeUnit" });

require("events").EventEmitter.defaultMaxListeners = 0;

registerEnumType(Recurrence, { name: "Recurrence" });
registerEnumType(PermissionLevel, { name: "PermissionLevel" });

export let app;

async function bootstrapApi() {
  app = await NestFactory.create(ApiModule, {
    logger: new InitializationLogger("NestFactory"),
  });

  app.useLogger(app.get(ConsoleLogger));

  //app.enableCors({ origin: "*" });
  app.enableCors({
    origin: '*', 
    methods: ['GET', 'POST'],
  });
  app.use(graphqlUploadExpress({ maxFileSize: 15000000, maxFiles: 1 }));
  app.use(json({ limit: "1mb" }));

  app.useGlobalFilters(new ExceptionCatcher(app.get(ConsoleLogger)));

  await app.listen(process.env.API_PORT);
}

if (!process.env.APPLICATION_ENVIRONMENT) {
  bootstrapApi();
}
