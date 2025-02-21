// src/Api/Services/GoogleCalendarService.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Recurrence } from '@prisma/client';
import UserRepository from '../Repository/UserRepository';
import GoogleCalendarEventDto from "../Dto/CalendarEventDto/GoogleCalendarEventDto";
import { DateTime } from 'luxon';

@Injectable()
export default class GoogleCalendarService {
    private readonly logger = new Logger(GoogleCalendarService.name);

    constructor(private readonly userRepository: UserRepository) {}

    /**
     * Helper: Formats a date string to include a default time (09:00) if the time is missing.
     * Then converts the date to Europe/Paris timezone.
     */
    private formatDateTime(dateStr: string): string {
	  let dt = DateTime.fromISO(dateStr, { zone: 'utc' });
	  // If hours and minutes are both 0, likely an all-day event; set a default time (09:00)
	  if (dt.hour === 0 && dt.minute === 0) {
		dt = dt.set({ hour: 9, minute: 0 });
	  }
	  // Convert to Europe/Paris timezone
	  return dt.setZone('Europe/Paris').toISO();
    }

    /**
     * Helper: Converts a given ISO date string from UTC to an ISO string in the Europe/Paris timezone.
     */
    private convertToEuropeParis(dateStr: string): string {
	  return DateTime.fromISO(dateStr, { zone: 'utc' })
		  .setZone('Europe/Paris')
		  .toISO();
    }

    /**
     * Parses recurring data from a Google Calendar event.
     */
    async parseRecurringData(event: any): Promise<{ isRecurring: boolean; recurringType: Recurrence }> {
	  if (event.recurrence && Array.isArray(event.recurrence)) {
		const recurrenceRule: string = event.recurrence[0];
		const freqMatch = recurrenceRule.match(/FREQ=([A-Z]+)/);
		if (freqMatch && freqMatch[1]) {
		    const freq = freqMatch[1];
		    let recurringType: Recurrence = 'NONE';
		    switch (freq) {
			  case 'DAILY':
				recurringType = 'DAILY';
				break;
			  case 'WEEKLY':
				recurringType = 'WEEKLY';
				break;
			  case 'MONTHLY':
				recurringType = 'MONTHLY';
				break;
			  case 'YEARLY':
			  case 'ANNUAL':
				recurringType = 'ANNUAL';
				break;
			  default:
				recurringType = 'NONE';
		    }
		    return { isRecurring: true, recurringType };
		}
	  }
	  return { isRecurring: false, recurringType: 'NONE' };
    }

    /**
     * Retrieves Google Calendar events for a given user.
     */
    async getEventsForUser(userId: number): Promise<GoogleCalendarEventDto[]> {
	  const user = await this.userRepository.findById(userId);
	  const accessToken = user.googleAccessToken;
	  if (!accessToken) {
		throw new Error('User does not have a valid Google access token.');
	  }

	  const calendarUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
	  try {
		const response = await axios.get(calendarUrl, {
		    headers: { Authorization: `Bearer ${accessToken}` },
		    params: { timeZone: "Europe/Paris" }
		});

		if (!response.data || !Array.isArray(response.data.items)) {
		    this.logger.warn('Google Calendar response does not include an "items" array.');
		    return [];
		}

		// Map each Google event into our DTO, applying formatDateTime to start and end fields.
		return await Promise.all(
			response.data.items.map(async (item: any) => {
			    const recurringData = await this.parseRecurringData(item);
			    return {
				  id: item.id,
				  summary: item.summary,
				  description: item.description,
				  due: this.formatDateTime(item.start?.dateTime || item.start?.date),
				  start: this.formatDateTime(item.start?.dateTime || item.start?.date),
				  end: this.formatDateTime(item.end?.dateTime || item.end?.date),
				  link: item?.hangoutLink,
				  location: item.location,
				  isRecurring: recurringData.isRecurring,
				  recurringType: recurringData.recurringType,
			    } as GoogleCalendarEventDto;
			}),
		);
	  } catch (error) {
		this.logger.error('Error fetching events from Google Calendar', error);
		throw error;
	  }
    }

    /**
     * Retrieves Google Tasks for a given user and maps them as CalendarEvent DTOs.
     * These items will later be stored with eventType TASK.
     * Since tasks don't accept a timezone parameter, we convert the UTC date manually.
     */
    async getTasksForUserAsEvents(userId: number): Promise<GoogleCalendarEventDto[]> {
	  const user = await this.userRepository.findById(userId);
	  const accessToken = user.googleAccessToken;
	  if (!accessToken) {
		throw new Error('User does not have a valid Google access token.');
	  }

	  const tasksUrl = 'https://www.googleapis.com/tasks/v1/lists/@default/tasks';
	  try {
		const response = await axios.get(tasksUrl, {
		    headers: { Authorization: `Bearer ${accessToken}` },
		});

		if (!response.data || !Array.isArray(response.data.items)) {
		    this.logger.warn('Google Tasks response does not include an "items" array.');
		    return [];
		}

		// Map each Google task into our DTO format.
		// For tasks, we use task.due as the date and convert it to Europe/Paris timezone.
		return response.data.items.map((task: any) => {
		    const dueDate = task.due;
		    return {
			  id: task.id,
			  summary: task.title,
			  description: task.notes || '',
			  due: this.convertToEuropeParis(dueDate),
			  start: this.convertToEuropeParis(dueDate),
			  end: this.convertToEuropeParis(dueDate),
			  link: task.webViewLink || '',
			  location: '', // Tasks typically don't have a location.
			  isRecurring: false,
			  recurringType: 'NONE',
		    } as GoogleCalendarEventDto;
		});
	  } catch (error) {
		this.logger.error('Error fetching tasks from Google Tasks API', error);
		throw error;
	  }
    }
}
