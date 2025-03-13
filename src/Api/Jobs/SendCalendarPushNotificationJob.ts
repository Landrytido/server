import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import {CalendarEventNotificationService} from "../Services/CalendarEventNotificationService";

@Injectable()
export class SendCalendarPushNotificationJob {
  private readonly logger = new Logger(SendCalendarPushNotificationJob.name);

  constructor(
        private readonly calendarEventNotificationService: CalendarEventNotificationService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handle() {
    await this.calendarEventNotificationService.sendNotifications();
  }
}
