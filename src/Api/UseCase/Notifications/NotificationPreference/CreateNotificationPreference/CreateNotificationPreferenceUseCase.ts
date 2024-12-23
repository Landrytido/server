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
      const user = await this.notificationPreference.findUserById(
        context.userId
      );

      const savedPreferences = await this.notificationPreference.save({
        // userId: context.userId,
        userId: user.userId, //a modifier si besoin
        type: dto.type,
        timeBefore: dto.timeBefore,
        timeUnit: dto.timeUnit,
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
