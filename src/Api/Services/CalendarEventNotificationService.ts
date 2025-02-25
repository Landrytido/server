// src/Core/Notification/Service/calendar-event-notification.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../Core/Datasource/Prisma';
import { PushNotificationService } from '../../Core/Notification/Service/push-notification.service';
import { PushNotificationPayload } from '../../Core/Notification/Interface/PushNotificationPayload';
import { CalendarEventType } from '@prisma/client';

@Injectable()
export class CalendarEventNotificationService {
    private readonly logger = new Logger(CalendarEventNotificationService.name);

    constructor(
	    private readonly prisma: PrismaService,
	    private readonly pushNotificationService: PushNotificationService,
    ) {}

    /**
     * Checks for calendar events and tasks that need notifications and sends them.
     */
    async sendNotifications(): Promise<void> {
	  const now = new Date();
	  let notifiedEvents = 0;
	  let notifiedTasks = 0;

	  // Fetch calendar events/tasks that have a notification preference, have not yet been push-notified,
	  // and where either startDate or dueDate is provided.
	  const events = await this.prisma.calendarEvent.findMany({
		where: {
		    notificationPreferenceId: { not: null },
		    pushNotificationSent: false,
		    OR: [
			  { startDate: { not: null } },
			  { dueDate: { not: null } },
		    ],
		},
		include: { notificationPreference: true, user: true },
	  });

	  for (const event of events) {
		// Determine which date to use: dueDate for tasks, startDate for events.
		let baseDate: Date | null = null;
		if (event.eventType === CalendarEventType.TASK) {
		    baseDate = event.dueDate ? new Date(event.dueDate) : null;
		} else {
		    baseDate = event.startDate ? new Date(event.startDate) : null;
		}
		if (!baseDate) continue;

		// Calculate the scheduled notification time.
		const notificationTime = new Date(baseDate);
		notificationTime.setMinutes(notificationTime.getMinutes() - event.notificationPreference.timeBefore);

		if (notificationTime <= now) {
		    // Retrieve all devices associated with the user.
		    const devices = await this.prisma.device.findMany({
			  where: { userId: event.user.id },
		    });

		    if (devices.length === 0) {
			  this.logger.warn(`No registered devices for user ${event.user.id}`);
			  continue;
		    }

		    // Send a notification to each device.
		    for (const device of devices) {
			  const payload: PushNotificationPayload = {
				token: device.token,
				title: event.title || (event.eventType === CalendarEventType.TASK ? 'Rappel Tâche' : 'Rappel Événement'),
				body: event.description,
				data: { eventId: event.id.toString(), type: event.eventType },
			  };
			  await this.pushNotificationService.sendNotification(payload);
		    }

		    // Mark the event/task as push-notified.
		    await this.prisma.calendarEvent.update({
			  where: { id: event.id },
			  data: { pushNotificationSent: true },
		    });

		    // Update the appropriate counter.
		    if (event.eventType === CalendarEventType.TASK) {
			  notifiedTasks++;
		    } else {
			  notifiedEvents++;
		    }
		}
	  }

	  // Log a single line with the counts.
	  this.logger.log(`Push notifications sent: ${notifiedEvents} events, ${notifiedTasks} tasks`);
    }
}
