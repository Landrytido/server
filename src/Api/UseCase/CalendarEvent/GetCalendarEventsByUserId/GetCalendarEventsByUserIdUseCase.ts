import { BadRequestException, Injectable } from "@nestjs/common";
import { CalendarEvent } from "@prisma/client";
import { UncontextualUseCase } from "src";
import CalendarEventRepository from "src/Api/Repository/CalendarEvent/CalendarEventRepository";

@Injectable()
export default class GetCalendarEventsByUserIdUseCase
  implements UncontextualUseCase<Promise<CalendarEvent[] | null>, [id: number]>
{
  constructor(
    private readonly calendarEventRepository: CalendarEventRepository,
  ) {}

  async handle(id: number): Promise<CalendarEvent[]> {
    try {
      return this.calendarEventRepository.findByUserId(id);
    } catch (error) {
      throw new BadRequestException("CalendarEvent not found.", error.message);
    }
  }
}
