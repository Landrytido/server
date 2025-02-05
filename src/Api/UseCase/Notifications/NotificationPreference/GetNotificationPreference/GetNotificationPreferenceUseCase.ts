import { BadRequestException, Injectable } from "@nestjs/common";
import { NotificationPreference } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import NotificationPreferenceRepository from "src/Api/Repository/NotificationPreferenceRepository";

@Injectable()
export default class GetNotificationPreferenceUseCase
  implements UseCase<Promise<NotificationPreference>, []>
{
  constructor(
    private readonly notificationPreferenceRepository: NotificationPreferenceRepository
  ) {}

  async handle(context: ContextualGraphqlRequest) {
    try {
      const getPreference =
        await this.notificationPreferenceRepository.findUserById(
          context.userId
        );
      return getPreference;
    } catch (error) {
      throw new BadRequestException(
        "GetNotificationPreferenceUseCase failed",
        error.message
      );
    }
  }
}
