import { ForbiddenException, Injectable } from "@nestjs/common";
import { Meeting } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import SaveMeetingDto from "./SaveMeetingDto";
import MeetingRepository from "src/Api/Repository/MeetingRepository";

@Injectable()
export default class SaveMeetingUseCase
  implements UseCase<Promise<Meeting>, [dto: SaveMeetingDto]>
{
  constructor(private readonly meetingRepository: MeetingRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: SaveMeetingDto
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
      if (!dto.id) {
        // Supprimez `id` pour une création
        delete prismaData.id;
      }

      // Sauvegarde ou mise à jour via le repository
      return this.meetingRepository.saveMeeting(prismaData);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
