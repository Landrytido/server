// File: src/UseCase/CalendarEvent/DeleteCalendarEventUseCase.ts

import { Injectable } from '@nestjs/common';
import { ContextualGraphqlRequest, UseCase } from '../../../../index';
import CalendarEventRepository from '../../../Repository/CalendarEvent/CalendarEventRepository';
import { CalendarEvent } from '@prisma/client';
import GoogleCalendarService from '../../../Services/GoogleCalendarService';

@Injectable()
export default class DeleteCalendarEventUseCase implements UseCase<Promise<CalendarEvent>, [id: number]> {
    constructor(
	    private readonly calendarEventRepository: CalendarEventRepository,
	    private readonly googleCalendarService: GoogleCalendarService,
    ) {}

    async handle(context: ContextualGraphqlRequest, id: number): Promise<CalendarEvent> {
	  // Retrieve the event before deletion
	  const event = await this.calendarEventRepository.findById(id);

	  if (event) {
		// Delete from Google if googleEventId exists, based on the type
		if (event.eventType === 'EVENT') {
		    await this.googleCalendarService.deleteGoogleCalendarEvent(context.userId, event);
		} else if (event.eventType === 'TASK') {
		    await this.googleCalendarService.deleteGoogleTask(context.userId, event);
		}
	  }

	  // Delete the event locally
	  return this.calendarEventRepository.delete(context.userId, id);
    }
}
