import { Injectable } from '@nestjs/common';
import { ContextualGraphqlRequest, UseCase } from '../../../../index';
import CalendarEventRepository from '../../../Repository/CalendarEvent/CalendarEventRepository';
import { CalendarEvent } from '@prisma/client';

@Injectable()
export default class DeleteCalendarEventUseCase implements UseCase<Promise<CalendarEvent>, [id: number]> {
    constructor(private readonly calendarEventRepository: CalendarEventRepository) {}

    async handle(context: ContextualGraphqlRequest, id: number): Promise<CalendarEvent> {
	  return this.calendarEventRepository.delete(context.userId, id);
    }
}
