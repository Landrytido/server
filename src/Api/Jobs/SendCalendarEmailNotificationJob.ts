// import { Injectable } from "@nestjs/common";
// import { Cron } from "@nestjs/schedule";
// import Mailer from "src/Core/Mailing/Mailer";
// import MeetingRepository from "../Repository/MeetingRepository";
// import { TimeUnit } from "@prisma/client";
// import EventRepository from "../Repository/EventRepository";
// import TaskRepository from "../Repository/TaskRepository";

// @Injectable()
// export class SendCalendarEmailNotificationJob {
//   constructor(
//     private readonly mailer: Mailer,
//     private readonly meetingRepository: MeetingRepository,
//     private readonly eventRepository: EventRepository,
//     private readonly taskRepository: TaskRepository,
//   ) {}

//   @Cron("* * * * *")
//   async handle() {
//     const now = new Date();
//     try {
//       const meetings = await this.meetingRepository.findAll();
//       const events = await this.eventRepository.findAll();
//       const tasks = await this.taskRepository.findAllTask();

//       for (const meeting of meetings) {
//         const notificationPreference = meeting.notificationPreference;

//         if (notificationPreference) {
//           const timeBeforeInMs = this.convertTimeToMilliseconds(
//             notificationPreference.timeBefore,
//             notificationPreference.timeUnit
//           );

//           const reminderTime = new Date(
//             meeting.startDate.getTime() - timeBeforeInMs
//           );

//           if (now >= reminderTime && meeting.notificationSent === false) {
//             const recipientData = meeting.user;

//             const reminderLink = `${process.env.FRONTEND_URL}/meeting?meetingToken=${meeting.token}`;

//             this.mailer.sendCalendarNotificationEmail(
//               {
//                 email: recipientData.email,
//                 firstName: recipientData.firstName,
//                 lastName: recipientData.lastName,
//               },
//               {
//                 title: meeting.title,
//                 description: meeting.description,
//                 startDate: meeting.startDate,
//                 endDate: meeting.endDate,
//                 location: meeting.location,
//                 place: meeting.place,
//                 url: meeting.link,
//               },
//               reminderLink,
//               "meeting"
//             );

//             console.log(
//               `Notification envoyée pour la réunion : ${meeting.id} ${meeting.title}`
//             );

//             await this.meetingRepository.markNotificationAsSent(meeting.id);
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Erreur lors de l'envoi des notifications :", error);
//     }
//   }

//   private convertTimeToMilliseconds(time: number, unit: TimeUnit) {
//     switch (unit) {
//       case TimeUnit.MINUTES:
//         return time * 60 * 1000;

//       case TimeUnit.HOURS:
//         return time * 60 * 60 * 1000;

//       case TimeUnit.DAYS:
//         return time * 24 * 60 * 60 * 1000;

//       default:
//         throw new Error("Unité de temps non reconnu");
//     }
//   }
// }

import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import Mailer from "src/Core/Mailing/Mailer";
import MeetingRepository from "../Repository/MeetingRepository";
import EventRepository from "../Repository/EventRepository";
import TaskRepository from "../Repository/TaskRepository";
import { TimeUnit } from "@prisma/client";

@Injectable()
export class SendCalendarEmailNotificationJob {
  constructor(
    private readonly mailer: Mailer,
    private readonly meetingRepository: MeetingRepository,
    private readonly eventRepository: EventRepository,
    private readonly taskRepository: TaskRepository
  ) {}

  @Cron("* * * * *")
  async handle() {
    const now = new Date();

    try {
      // Traitement des réunions
      await this.processNotifications(
        await this.meetingRepository.findAll(),
        "meeting",
        now,
        (item) =>
          `${process.env.FRONTEND_URL}/meeting?meetingToken=${item.token}`,
        (item) => this.meetingRepository.markNotificationAsSent(item.id)
      );

      // Traitement des événements
      await this.processNotifications(
        await this.eventRepository.findAll(),
        "event",
        now,
        (item) => `${process.env.FRONTEND_URL}/event?eventToken=${item.token}`,
        (item) => this.eventRepository.markNotificationAsSent(item.id)
      );

      // Traitement des tâches
      await this.processNotifications(
        await this.taskRepository.findAllTask(),
        "task",
        now,
        (item) => `${process.env.FRONTEND_URL}/task?taskToken=${item.token}`,
        (item) => this.taskRepository.markNotificationAsSent(item.id)
      );
    } catch (error) {
      console.error("Erreur lors de l'exécution des notifications :", error);
    }
  }

  private async processNotifications<T>(
    items: T[],
    type: "meeting" | "event" | "task",
    now: Date,
    generateLink: (item: T) => string,
    markAsSent: (item: T) => Promise<void>
  ) {
    for (const item of items) {
      const notificationPreference = (item as any).notificationPreference;

      if (notificationPreference) {
        const timeBeforeInMs = this.convertTimeToMilliseconds(
          notificationPreference.timeBefore,
          notificationPreference.timeUnit
        );

        // Différenciation pour les tâches avec `dueDate`
        const referenceDate =
          type === "task" ? (item as any).dueDate : (item as any).startDate;

        // Si `referenceDate` est null (cas des tâches sans `dueDate`)
        if (!referenceDate) {
          console.warn(
            `Skipping ${type} with ID ${(item as any).id} due to missing reference date`
          );
          continue;
        }

        const reminderTime = new Date(referenceDate.getTime() - timeBeforeInMs);

        if (now >= reminderTime && (item as any).notificationSent === false) {
          const recipientData = (item as any).user;

          const reminderLink = generateLink(item);

          // Envoi de l'email via Mailer
          await this.mailer.sendCalendarNotificationEmail(
            {
              email: recipientData.email,
              firstName: recipientData.firstName,
              lastName: recipientData.lastName,
            },
            {
              title: (item as any).title,
              description: (item as any).description,
              startDate: (item as any).startDate,
              endDate: (item as any).endDate,
              location: (item as any).location,
              place: (item as any).place,
              url: (item as any).link,
              dueDate: (item as any).dueDate,
            },
            reminderLink,
            type
          );

          console.log(
            `Notification envoyée pour ${type} : ${(item as any).id} ${
              (item as any).title
            }`
          );

          // Marquer la notification comme envoyée
          await markAsSent(item);
        }
      }
    }
  }

  private convertTimeToMilliseconds(time: number, unit: TimeUnit): number {
    switch (unit) {
      case TimeUnit.MINUTES:
        return time * 60 * 1000;
      case TimeUnit.HOURS:
        return time * 60 * 60 * 1000;
      case TimeUnit.DAYS:
        return time * 24 * 60 * 60 * 1000;
      default:
        throw new Error("Unité de temps non reconnue");
    }
  }
}
