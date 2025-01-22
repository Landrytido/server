import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import Authenticator from "../Service/authentication/Authenticator";
import RequestEventEmitter from "src/Core/Event/Emitter/RequestEventEmitter";
import MeetingRepository from "src/Api/Repository/MeetingRepository";
import { ContextualGraphqlRequest, UseCase } from "src";
import TokenValidationDto from "../Dto/TokenValidationDto";
import { ValidateEventTokenResponse } from "../Entity/ValidateEventTokenResponseEntity";
import EventRepository from "src/Api/Repository/EventRepository";
import TaskRepository from "src/Api/Repository/TaskRepository";

// interface ValidEntity {
//   id: number;
//   // token: string;
// }

@Injectable()
export default class ValidateEventToken
  implements
    UseCase<Promise<ValidateEventTokenResponse>, [dto: TokenValidationDto]>
{
  constructor(
    @Inject("Authenticator") private authenticator: Authenticator,
    private readonly eventEmitter: RequestEventEmitter,
    private readonly meetingRepository: MeetingRepository,
    private readonly eventRepository: EventRepository,
    private readonly taskRepository: TaskRepository
  ) {}

  // async handle(context: ContextualGraphqlRequest, dto: TokenValidationDto) {
  //   try {
  //     await this.authenticator.validate(dto.token);

  //     const meeting = await this.meetingRepository.findByToken(dto.token);

  //     if (!meeting) {
  //       this.eventEmitter.emit("validate_token_failed", {
  //         context,
  //         dto,
  //         error: "Invalid token or no associated event",
  //       });
  //       return { isValid: false };
  //     }

  //     this.eventEmitter.emit("validate_token_successfully", { context, dto });

  //     return { isValid: true, eventId: meeting.id };
  //   } catch (error) {
  //     this.eventEmitter.emit("validate_token_failed", {
  //       context,
  //       dto,
  //       error: error.message,
  //     });

  //     throw new BadRequestException(error.message);
  //   }
  // }

  async handle(
    context: ContextualGraphqlRequest,
    dto: TokenValidationDto
  ): Promise<ValidateEventTokenResponse> {
    try {
      await this.authenticator.validate(dto.token);

      // Essayer de trouver le token dans les trois entités : Meeting, Event, Task
      const meeting = await this.meetingRepository.findByToken(dto.token);
      const event = await this.eventRepository.findByToken(dto.token);
      const task = await this.taskRepository.findByToken(dto.token);

      // Si aucune entité n'est trouvée
      if (!meeting && !event && !task) {
        this.eventEmitter.emit("validate_token_failed", {
          context,
          dto,
          error: "Invalid token or no associated entity",
        });
        return {
          isValid: false,
          entityId: null,
          entityType: null,
          userId: null,
        };
      }

      // Détection du type d'entité et création de la réponse
      let entityId = null;
      let entityType = null;
      let userId = null;

      if (meeting) {
        console.log("meeting :", meeting);
        entityId = meeting.id;
        entityType = "meeting";
        userId = meeting.userId;
      } else if (event) {
        console.log("event :", event);
        entityId = event.id;
        entityType = "event";
        userId = event.userId;
      } else if (task) {
        console.log("task :", task);
        entityId = task.id;
        entityType = "task";
        userId = task.userId;
      }

      console.log("entity/entityId/entityType :", entityId, entityType);

      // Emit success event
      this.eventEmitter.emit("validate_token_successfully", { context, dto });

      return { isValid: true, entityId, entityType, userId };
    } catch (error) {
      this.eventEmitter.emit("validate_token_failed", {
        context,
        dto,
        error: error.message,
      });
      throw new BadRequestException(error.message);
    }
  }
}
