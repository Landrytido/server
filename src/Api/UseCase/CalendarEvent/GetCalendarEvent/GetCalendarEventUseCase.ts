import { Injectable, NotFoundException } from '@nestjs/common';
import { ContextualGraphqlRequest, UseCase } from '../../../../index';
import CalendarEventRepository from '../../../Repository/CalendarEvent/CalendarEventRepository';
import { CalendarEvent } from '@prisma/client';

@Injectable()
export default class GetCalendarEventUseCase implements UseCase<Promise<CalendarEvent>, [id: number]> {
    constructor(private readonly calendarEventRepository: CalendarEventRepository) {}

    async handle(context: ContextualGraphqlRequest, id: number): Promise<CalendarEvent> {
	  const event = await this.calendarEventRepository.findById(id);
	  if (!event || event.userId !== context.userId) {
		throw new NotFoundException('Calendar event not found');
	  }
	  return event;
    }
}
