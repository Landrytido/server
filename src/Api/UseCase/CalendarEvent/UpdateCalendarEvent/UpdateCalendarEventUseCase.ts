import { Injectable } from '@nestjs/common';
import { ContextualGraphqlRequest, UseCase } from '../../../../index';
import CalendarEventRepository from '../../../Repository/CalendarEvent/CalendarEventRepository';
import { CalendarEvent } from '@prisma/client';
import { UpdateCalendarEventDto } from '../../../Dto/CalendarEventDto/UpdateCalendarEventDto';

@Injectable()
export default class UpdateCalendarEventUseCase implements UseCase<Promise<CalendarEvent>, [id: number, dto: UpdateCalendarEventDto]> {
    constructor(private readonly calendarEventRepository: CalendarEventRepository) {}

    async handle(context: ContextualGraphqlRequest, id: number, dto: UpdateCalendarEventDto): Promise<CalendarEvent> {
	  return this.calendarEventRepository.update(context.userId, id, dto);
    }
}
