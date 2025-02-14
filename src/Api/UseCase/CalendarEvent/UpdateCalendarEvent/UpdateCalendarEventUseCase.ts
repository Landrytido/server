import { BadRequestException, Injectable } from "@nestjs/common";
import { CalendarEvent } from "@prisma/client";
import { UncontextualUseCase } from "src";
import UpdateCalendarEventDto from "src/Api/Dto/CalendarEvent/UpdateCalendarEventDto";
import CalendarEventRepository from "src/Api/Repository/CalendarEvent/CalendarEventRepository";

@Injectable()
export default class UpdateCalendarEventUseCase
  implements
    UncontextualUseCase<
      Promise<CalendarEvent>,
      [id: number, dto: UpdateCalendarEventDto]
    >
{
  constructor(
    private readonly calendarEventRepository: CalendarEventRepository,
  ) {}

  async handle(
    id: number,
    dto: UpdateCalendarEventDto,
  ): Promise<CalendarEvent> {
    try {
      return this.calendarEventRepository.update(id, dto);
    } catch (error) {
      throw new BadRequestException(
        "Unable to update CalendarEvent",
        error.message,
      );
    }
  }
}
