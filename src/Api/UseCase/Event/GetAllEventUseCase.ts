import { Injectable, NotFoundException } from "@nestjs/common";
import { Event } from "@prisma/client";
import { ContextualGraphqlRequest } from "src";
import EventRepository from "src/Api/Repository/EventRepository";

// TODO: Remove this model after refactoring tasks, events, meetings into CalendarEvent ❌
@Injectable()
export default class GetAllEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async handle(context: ContextualGraphqlRequest): Promise<Event[]> {
    const events = await this.eventRepository.findAll();

    if (!events || events.length === 0) {
      throw new NotFoundException("Events not Found");
    }

    return events;
  }
}
