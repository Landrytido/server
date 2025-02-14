import { Injectable } from '@nestjs/common';
import { ContextualGraphqlRequest, UseCase } from '../../../../index';
import CalendarEventRepository from '../../../Repository/CalendarEvent/CalendarEventRepository';
import { CalendarEvent } from '@prisma/client';
import { CreateCalendarEventDto } from '../../../Dto/CalendarEventDto/CreateCalendarEventDto';

@Injectable()
export default class CreateCalendarEventUseCase implements UseCase<Promise<CalendarEvent>, [dto: CreateCalendarEventDto]> {
    constructor(private readonly calendarEventRepository: CalendarEventRepository) {}

    async handle(context: ContextualGraphqlRequest, dto: CreateCalendarEventDto): Promise<CalendarEvent> {
	  return this.calendarEventRepository.create(context.userId, dto);
    }
}
