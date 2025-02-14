import { ForbiddenException, Injectable, Inject } from "@nestjs/common";
import { Meeting } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import SaveMeetingDto from "./SaveMeetingDto";
import MeetingRepository from "src/Api/Repository/MeetingRepository";
import Authenticator from "src/Core/Security/Service/authentication/Authenticator";
import UserRepository from "src/Api/Repository/UserRepository";

// TODO: Remove this model after refactoring tasks, events, meetings into CalendarEvent ❌
@Injectable()
export default class SaveMeetingUseCase
  implements UseCase<Promise<Meeting>, [dto: SaveMeetingDto]>
{
  constructor(
    private readonly meetingRepository: MeetingRepository,
    // private readonly userRepository: UserRepository,
    @Inject("Authenticator") private authenticator: Authenticator,
  ) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: SaveMeetingDto,
  ): Promise<Meeting> {
    try {
      // Remplacez dto.userId par context.userId pour garantir que l'utilisateur authentifié est utilisé
      const userId = context.userId;

      // Si l'utilisateur authentifié n'est pas trouvé, déclenchez une exception
      if (!userId) {
        throw new ForbiddenException("User not authenticated");
      }

      // Assurez-vous que le DTO utilise l'userId du contexte
      dto.userId = userId;

      // Transformation des données pour Prisma
      const prismaData: any = { ...dto };

      if (dto.location === "Présentiel") {
        prismaData.place = dto.place;
        prismaData.link = null;
      } else if (dto.location === "Distanciel") {
        prismaData.link = dto.link;
        prismaData.place = null;
      }

      if (!dto.id) {
        // Supprimez `id` pour une création
        delete prismaData.id;
      }

      if (dto.notificationPreferenceId) {
        // const userData = await this.userRepository.findById(userId);
        // const email = userData.email; a remeetre sil faut

        const email = context.email;

        // Génération d'un token avec les informations du user
        const token = await this.authenticator.createToken({ userId, email });
        prismaData.token = token;
      }

      const meeting = await this.meetingRepository.saveMeeting(prismaData);

      console.log("Meeting final sauvegardé :", meeting);

      return meeting;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
