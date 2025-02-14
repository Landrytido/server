import { BadRequestException, Injectable } from "@nestjs/common";
import { CalendarEvent } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import CreateCalendarEventDto from "src/Api/Dto/CalendarEvent/CreateCalendarEventDto";
import CalendarEventRepository from "src/Api/Repository/CalendarEvent/CalendarEventRepository";

@Injectable()
export default class CreateCalendarEventUseCase
  implements UseCase<Promise<CalendarEvent>, [dto: CreateCalendarEventDto]>
{
  constructor(
    private readonly calendarEventRepository: CalendarEventRepository,
  ) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: CreateCalendarEventDto,
  ): Promise<CalendarEvent> {
    try {
      return this.calendarEventRepository.create(context.userId, dto);
    } catch (error) {
      throw new BadRequestException(
        "Unable to create CalendarEvent",
        error.message,
      );
    }
  }
}
