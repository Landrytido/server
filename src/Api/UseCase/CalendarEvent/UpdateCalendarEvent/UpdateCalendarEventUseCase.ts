// File: src/UseCase/CalendarEvent/UpdateCalendarEventUseCase.ts

import { Injectable } from '@nestjs/common';
import { ContextualGraphqlRequest, UseCase } from '../../../../index';
import CalendarEventRepository from '../../../Repository/CalendarEvent/CalendarEventRepository';
import { CalendarEvent } from '@prisma/client';
import { UpdateCalendarEventDto } from '../../../Dto/CalendarEventDto/UpdateCalendarEventDto';
import GoogleCalendarService from '../../../Services/GoogleCalendarService';

@Injectable()
export default class UpdateCalendarEventUseCase implements UseCase<Promise<CalendarEvent>, [id: number, dto: UpdateCalendarEventDto]> {
    constructor(
	    private readonly calendarEventRepository: CalendarEventRepository,
	    private readonly googleCalendarService: GoogleCalendarService,
    ) {}

    async handle(context: ContextualGraphqlRequest, id: number, dto: UpdateCalendarEventDto): Promise<CalendarEvent> {
	  // Update the local event record
	  const event = await this.calendarEventRepository.update(context.userId, id, dto);

	  // Immediately push the updated event/task to Google
	  if (event.eventType === 'EVENT') {
		await this.googleCalendarService.updateGoogleCalendarEvent(context.userId, event);
	  } else if (event.eventType === 'TASK') {
		await this.googleCalendarService.updateGoogleTask(context.userId, event);
	  }
	  return event;
    }
}
