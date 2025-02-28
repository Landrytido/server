import { BadRequestException, Injectable } from "@nestjs/common";
import { CalendarEventInvitation } from "@prisma/client";
import { UncontextualUseCase } from "src";
import CalendarEventInvitationRepository from "src/Api/Repository/CalendarEventInvitation/CalendarEventInvitationRepository";

@Injectable()
export default class GetCalendarEventInvitationsBySenderIdUseCase
  implements
    UncontextualUseCase<Promise<CalendarEventInvitation[]>, [id: number]>
{
  constructor(
    private readonly calendarEventInvitationRepository: CalendarEventInvitationRepository,
  ) {}

  async handle(id: number): Promise<CalendarEventInvitation[]> {
    try {
      console.error(id);
      return await this.calendarEventInvitationRepository.findBySenderId(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
