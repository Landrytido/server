import { BadRequestException, Injectable } from "@nestjs/common";
import {
  NotificationPreference,
  NotificationType,
  TimeUnit,
} from "@prisma/client";
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
    // Exemple d'implémentation :
    // const result: NotificationPreference = {
    //   id: 1, // Exemple - remplacer par l'ID réel généré
    //   userId: context.userId, // Assurez-vous que userId est bien défini
    //   type: NotificationType.EMAIL, // Remplacer par une valeur réelle
    //   timeBefore: dto.timeBefore,
    //   timeUnit: TimeUnit.HOURS, // Remplacer par une valeur réelle
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // };

    try {
      const savedPreferences = await this.notificationPreference.save({
        userId: context.userId,
        type: NotificationType.EMAIL,
        timeBefore: dto.timeBefore,
        timeUnit: TimeUnit.HOURS,
      });
      console.log("notifPref useCase", savedPreferences); //à supp
      return savedPreferences;
    } catch (error) {
      throw new BadRequestException(
        "CreateNotificationPreferenceUseCase failed",
        error.message
      );
    }
  }
}
