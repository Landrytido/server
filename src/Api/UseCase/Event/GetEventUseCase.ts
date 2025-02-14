import { Injectable, NotFoundException } from "@nestjs/common";
import { Event } from "@prisma/client";
import { ContextualGraphqlRequest } from "src";
import EventRepository from "src/Api/Repository/EventRepository";

@Injectable()
export default class GetEventUseCase {
    constructor(private readonly eventRepository: EventRepository) {}

    async handle(context: ContextualGraphqlRequest, id: number): Promise<Event> {
        const event = await this.eventRepository.findById(id);

        if (!event) {
            throw new NotFoundException('Event not Found');
        }

        return event;
    }
}
