import { BadRequestException, Injectable } from "@nestjs/common";
import { NotificationPreference, Prisma } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import { SaveNotificationPreferenceDto } from "./SaveNotificationPreferenceDto";
import NotificationPreferenceRepository from "src/Api/Repository/NotificationPreferenceRepository";

@Injectable()
export default class CreateNotificationPreferenceUseCase
  implements
    UseCase<
      Promise<NotificationPreference>,
      [dto: SaveNotificationPreferenceDto]
    >
{
  constructor(
    private readonly notificationPreference: NotificationPreferenceRepository
  ) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: SaveNotificationPreferenceDto
  ) {
    try {
      console.log("user", context.userId);
      console.log("DTO reçu:", dto);

      // Vérifie que `types` contient bien des valeurs
      if (!dto.types || dto.types.length === 0) {
        throw new BadRequestException(
          "At least one notification type must be selected."
        );
      }

      // Formatage des types pour Prisma
      const typesData = dto.types.map((type) => ({ type }));
      console.log("typesData :", typesData);

      const savedPreferences = await this.notificationPreference.save({
        userId: context.userId,
        types: {
          deleteMany: {},
          create: typesData, // Ajoute les nouvelles préférences
        },
        timeBefore: dto.timeBefore,
        timeUnit: dto.timeUnit,
      });

      console.log("notifPref useCase", savedPreferences); //à supp
      return savedPreferences;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        "CreateNotificationPreferenceUseCase failed",
        error.message
      );
    }
  }
}
