import { BadRequestException, Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "src";
import EventRepository from "src/Api/Repository/EventRepository";
import { Event } from "@prisma/client";

// TODO: Remove this model after refactoring tasks, events, meetings into CalendarEvent ❌
@Injectable()
export default class GetEventByUserIdUseCase
  implements UseCase<Promise<Event[]>, []>
{
  constructor(private readonly eventRepository: EventRepository) {}

  async handle(context: ContextualGraphqlRequest) {
    try {
      return await this.eventRepository.findByUserId(context.userId);
    } catch (error) {
      throw new BadRequestException(
        "GetEventByUserIdUseCaseFailed",
        error.message,
      );
    }
  }
}
