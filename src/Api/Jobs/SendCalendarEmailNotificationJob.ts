import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import Mailer from "src/Core/Mailing/Mailer";
import MeetingRepository from "../Repository/MeetingRepository";
import { TimeUnit } from "@prisma/client";

@Injectable()
export class SendCalendarEmailNotificationJob {
  constructor(
    private readonly mailer: Mailer,
    private readonly meetingRepository: MeetingRepository
  ) {}

  @Cron("* * * * *")
  async handle() {
    const now = new Date();
    try {
      const meetings = await this.meetingRepository.findAll();

      for (const meeting of meetings) {
        const notificationPreference = meeting.notificationPreference;

        if (notificationPreference) {
          const timeBeforeInMs = this.convertTimeToMilliseconds(
            notificationPreference.timeBefore,
            notificationPreference.timeUnit
          );

          const reminderTime = new Date(
            meeting.startDate.getTime() - timeBeforeInMs
          );

          if (now >= reminderTime && meeting.notificationSent === false) {
            const recipientData = meeting.user;

            this.mailer.sendCalendarNotificationEmail(
              {
                email: recipientData.email,
                firstName: recipientData.firstName,
                lastName: recipientData.lastName,
              },
              {
                title: meeting.title,
                description: meeting.description,
                startDate: meeting.startDate,
                endDate: meeting.endDate,
                location: meeting.location,
              },
              "meeting"
            );

            console.log(
              `Notification envoyée pour la réunion : ${meeting.id} ${meeting.title}`
            );

            await this.meetingRepository.markNotificationAsSent(meeting.id);
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des notifications :", error);
    }
  }

  private convertTimeToMilliseconds(time: number, unit: TimeUnit) {
    switch (unit) {
      case TimeUnit.MINUTES:
        return time * 60 * 1000;

      case TimeUnit.HOURS:
        return time * 60 * 60 * 1000;

      case TimeUnit.DAYS:
        return time * 24 * 60 * 60 * 1000;

      default:
        throw new Error("Unité de temps non reconnu");
    }
  }
}
