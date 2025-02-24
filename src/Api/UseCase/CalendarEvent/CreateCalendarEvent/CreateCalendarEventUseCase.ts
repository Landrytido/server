// File: src/UseCase/CalendarEvent/CreateCalendarEventUseCase.ts

import { Injectable } from '@nestjs/common';
import { ContextualGraphqlRequest, UseCase } from '../../../../index';
import CalendarEventRepository from '../../../Repository/CalendarEvent/CalendarEventRepository';
import { CalendarEvent } from '@prisma/client';
import { CreateCalendarEventDto } from '../../../Dto/CalendarEventDto/CreateCalendarEventDto';
import GoogleCalendarService from '../../../Services/GoogleCalendarService';

@Injectable()
export default class CreateCalendarEventUseCase implements UseCase<Promise<CalendarEvent>, [dto: CreateCalendarEventDto]> {
    constructor(
	    private readonly calendarEventRepository: CalendarEventRepository,
	    private readonly googleCalendarService: GoogleCalendarService,
    ) {}

    async handle(context: ContextualGraphqlRequest, dto: CreateCalendarEventDto): Promise<CalendarEvent> {
	  // Create the local event record
	  const event = await this.calendarEventRepository.create(context.userId, dto);

	  // Immediately push the new event/task to Google
	  if (event.eventType === 'EVENT') {
		await this.googleCalendarService.pushCalendarEvent(context.userId, event);
	  } else if (event.eventType === 'TASK') {
		await this.googleCalendarService.pushTask(context.userId, event);
	  }
	  return event;
    }
}
