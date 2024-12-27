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

      const savedPreferences = await this.notificationPreference.save({
        userId: context.userId,
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
