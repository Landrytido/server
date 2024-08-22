import { ForbiddenException, Injectable } from "@nestjs/common";
import { Event } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import SaveEventDto from "./SaveEventDto";
import EventRepository from "src/Api/Repository/EventRepository";

@Injectable()
export default class SaveEventUseCase
  implements UseCase<Promise<Event>, [dto: SaveEventDto]>
{
  constructor(private readonly eventRepository: EventRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: SaveEventDto
  ): Promise<Event> {
    try {
      if (dto.id && context.userId !== dto.userId) {
        throw new ForbiddenException("Not authorized");
      }
      return this.eventRepository.saveEvent(dto);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
