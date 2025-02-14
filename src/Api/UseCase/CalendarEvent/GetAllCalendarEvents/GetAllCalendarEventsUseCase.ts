import { Injectable } from '@nestjs/common';
import { ContextualGraphqlRequest, UseCase } from '../../../../index';
import CalendarEventRepository from '../../../Repository/CalendarEvent/CalendarEventRepository';
import { CalendarEvent } from '@prisma/client';

@Injectable()
export default class GetAllCalendarEventsUseCase implements UseCase<Promise<CalendarEvent[]>, []> {
    constructor(private readonly calendarEventRepository: CalendarEventRepository) {}

    async handle(context: ContextualGraphqlRequest): Promise<CalendarEvent[]> {
	  return this.calendarEventRepository.findByUserId(context.userId);
    }
}
