import { Injectable, NotFoundException } from '@nestjs/common';
import { ContextualGraphqlRequest, UseCase } from '../../../../index';
import CalendarEventRepository from '../../../Repository/CalendarEvent/CalendarEventRepository';
import { CalendarEvent } from '@prisma/client';

@Injectable()
export default class GetCalendarEventByTokenUseCase implements UseCase<Promise<CalendarEvent>, [token: string]> {
    constructor(private readonly calendarEventRepository: CalendarEventRepository) {}

    async handle(context: ContextualGraphqlRequest, token: string): Promise<CalendarEvent> {
	  const event = await this.calendarEventRepository.findByToken(token);
	  if (!event || event.userId !== context.userId) {
		throw new NotFoundException('Calendar event not found');
	  }
	  return event;
    }
}
