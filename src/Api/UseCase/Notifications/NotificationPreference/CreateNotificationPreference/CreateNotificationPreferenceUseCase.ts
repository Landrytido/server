import { BadRequestException, Injectable } from "@nestjs/common";
import { NotificationPreference } from "@prisma/client";
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
      const userFound = await this.notificationPreference.findUserById(
        context.userId
      );

      console.log("user", context.userId);
      console.log("user2", userFound);

      const savedPreferences = await this.notificationPreference.save({
        // userId: context.userId,
        userId: userFound.userId, //a modifier si besoin
        type: dto.type,
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
