import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Event } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import SaveEventDto from "./SaveEventDto";
import EventRepository from "src/Api/Repository/EventRepository";
import UserRepository from "src/Api/Repository/UserRepository";
import Authenticator from "src/Core/Security/Service/authentication/Authenticator";

// TODO: Remove this model after refactoring tasks, events, meetings into CalendarEvent ❌
@Injectable()
export default class SaveEventUseCase
  implements UseCase<Promise<Event>, [dto: SaveEventDto]>
{
  constructor(
    private readonly eventRepository: EventRepository,
    // private readonly userRepository: UserRepository,
    @Inject("Authenticator") private authenticator: Authenticator,
  ) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: SaveEventDto,
  ): Promise<Event> {
    try {
      const userId = context.userId;

      if (dto.id && userId !== dto.userId) {
        throw new ForbiddenException("Not authorized");
      }

      dto.userId = userId;

      const prismaData: any = { ...dto };

      if (dto.location === "Présentiel") {
        prismaData.place = dto.place;
        prismaData.link = null;
      } else if (dto.location === "Distanciel") {
        prismaData.link = dto.link;
        prismaData.place = null;
      }

      if (dto.notificationPreferenceId) {
        // const userData = await this.userRepository.findById(userId);
        // const email = userData.email; a remeetre sil faut

        const email = context.email;

        // Génération d'un token avec les informations du user
        const token = await this.authenticator.createToken({ userId, email });
        prismaData.token = token;
      }

      console.log("prismaData : ", prismaData);

      const event = await this.eventRepository.saveEvent(prismaData);

      console.log("event : ", event);

      return event;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
