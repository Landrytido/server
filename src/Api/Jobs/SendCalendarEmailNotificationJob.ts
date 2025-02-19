import {Injectable, Logger} from "@nestjs/common";
import {Cron, CronExpression} from "@nestjs/schedule";
import Mailer from "src/Core/Mailing/Mailer";
import {CalendarEventType, TimeUnit} from "@prisma/client";
import CalendarEventRepository from "../Repository/CalendarEvent/CalendarEventRepository";

@Injectable()
export class SendCalendarEmailNotificationJob {
    private readonly logger = new Logger(SendCalendarEmailNotificationJob.name);

    constructor(
	    private readonly mailer: Mailer,
	    private readonly calendarEventRepository: CalendarEventRepository
    ) {
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async handle() {
	  const now = new Date();
	  this.logger.log("Email notification cron job")

	  try {
		// Récupérer tous les CalendarEvents de type EVENT et TASK
		const events = await this.calendarEventRepository.findByType([
		    CalendarEventType.EVENT,
		    CalendarEventType.TASK,
		]);

		// Process notifications pour chaque événement récupéré
		await this.processNotifications(events, now);
	  } catch (error) {
		this.logger.error("Erreur lors de l'exécution des notifications :", error);
	  }
    }

    private async processNotifications(items: any[], now: Date) {
	  for (const item of items) {
		const notificationPreference = item.notificationPreference;
		if (notificationPreference) {
		    const timeBeforeInMs = this.convertTimeToMilliseconds(
			    notificationPreference.timeBefore,
			    notificationPreference.timeUnit
		    );
		    // Pour les tâches, utiliser dueDate ; pour les événements, startDate
		    const referenceDate =
			    item.eventType === CalendarEventType.TASK ? item.dueDate : item.startDate;

		    if (!referenceDate) {
			  this.logger.warn(
				  `Skipping ${item.eventType} with ID ${item.id} due to missing reference date`
			  );
			  continue;
		    }

		    const reminderTime = new Date(referenceDate.getTime() - timeBeforeInMs);

		    if (now >= reminderTime && item.notificationSent === false) {
			  const recipientData = item.user; // Supposé que 'item.user' contient les infos utilisateur
			  const reminderLink = this.generateLink(item);

			  await this.mailer.sendCalendarNotificationEmail(
				  {
					email: recipientData.email,
					firstName: recipientData.firstName,
					lastName: recipientData.lastName,
				  },
				  {
					title: item.title,
					description: item.description,
					startDate: item.startDate,
					endDate: item.endDate,
					location: item.location,
					place: item.place,
					url: item.link,
					dueDate: item.dueDate,
				  },
				  reminderLink,
				  item.eventType === CalendarEventType.TASK ? CalendarEventType.TASK : CalendarEventType.EVENT
			  );

			  this.logger.log(
				  `Notification envoyée pour ${item.eventType} : ${item.id} ${item.title}`
			  );

			  // Marquer la notification comme envoyée
			  await this.calendarEventRepository.markNotificationAsSent(item.id);
		    }
		}
	  }
    }

    private generateLink(item: any): string {
	  const baseUrl = process.env.FRONTEND_URL;
	  if (item.eventType === CalendarEventType.TASK) {
		return `${baseUrl}/task?taskToken=${item.token}`;
	  } else {
		return `${baseUrl}/event?eventToken=${item.token}`;
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
