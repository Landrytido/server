import { BadRequestException, Injectable } from "@nestjs/common";
import { CalendarEvent } from "@prisma/client";
import { UncontextualUseCase } from "src";
import CalendarEventRepository from "src/Api/Repository/CalendarEvent/CalendarEventRepository";

@Injectable()
export default class GetCalendarEventByTokenUseCase
  implements UncontextualUseCase<Promise<CalendarEvent | null>, [token: string]>
{
  constructor(
    private readonly calendarEventRepository: CalendarEventRepository,
  ) {}

  async handle(token: string): Promise<CalendarEvent> {
    try {
      return this.calendarEventRepository.findByToken(token);
    } catch (error) {
      throw new BadRequestException("CalendarEvent not found.", error.message);
    }
  }
}
