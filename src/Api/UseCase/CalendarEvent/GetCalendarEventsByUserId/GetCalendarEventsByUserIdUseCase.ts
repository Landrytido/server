import { Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import CalendarEventRepository from "../../../Repository/CalendarEvent/CalendarEventRepository";
import { CalendarEvent } from "@prisma/client";

@Injectable()
export default class GetCalendarEventsByUserIdUseCase
  implements UseCase<Promise<CalendarEvent[]>, [userId: number]>
{
  constructor(
    private readonly calendarEventRepository: CalendarEventRepository,
  ) {}

  async handle(context: ContextualGraphqlRequest): Promise<CalendarEvent[]> {
    // You might add permission checks here if needed.
    return this.calendarEventRepository.findByUserId(context.userId);
  }
}
