import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import Mailer from "src/Core/Mailing/Mailer";

@Injectable()
export class SendCalendarEmailNotificationJob {
  constructor(private readonly mailer: Mailer) {}

  // @Cron("0 0 10 * * *")
  // async handle
}
