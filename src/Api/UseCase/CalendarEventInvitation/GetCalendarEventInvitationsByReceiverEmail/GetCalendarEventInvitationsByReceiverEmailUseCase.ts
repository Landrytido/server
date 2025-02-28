import { BadRequestException, Injectable } from "@nestjs/common";
import { CalendarEventInvitation } from "@prisma/client";
import { UncontextualUseCase } from "src";
import CalendarEventInvitationRepository from "src/Api/Repository/CalendarEventInvitation/CalendarEventInvitationRepository";

@Injectable()
export default class GetCalendarEventInvitationsByReceiverEmailUseCase
  implements
    UncontextualUseCase<Promise<CalendarEventInvitation[]>, [email: string]>
{
  constructor(
    private readonly calendarEventInvitationRepository: CalendarEventInvitationRepository,
  ) {}

  async handle(email: string): Promise<CalendarEventInvitation[]> {
    try {
      return await this.calendarEventInvitationRepository.findByReceiverEmail(
        email,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
