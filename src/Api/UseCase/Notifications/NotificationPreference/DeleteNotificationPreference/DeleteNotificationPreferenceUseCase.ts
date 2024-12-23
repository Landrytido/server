import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { NotificationPreference } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import NotificationPreferenceRepository from "src/Api/Repository/NotificationPreferenceRepository";
import InsufficientPermissionException from "src/Core/Exception/InsufficientPermissionException";

@Injectable()
export default class DeleteNotificationPreferenceUseCase
  implements
    UseCase<
      Promise<NotificationPreference>,
      [preferenceNotificationId: Number]
    >
{
  constructor(
    private readonly notificationPreferenceRepository: NotificationPreferenceRepository
  ) {}

  async handle(
    context: ContextualGraphqlRequest,
    preferenceNotificationId: number
  ) {
    try {
      const notificationId =
        await this.notificationPreferenceRepository.findById(
          preferenceNotificationId
        );

      if (!notificationId)
        throw new NotFoundException(
          "Failed to find notification preference with ID" +
            preferenceNotificationId
        );

      if (notificationId.userId !== context.userId)
        throw new InsufficientPermissionException(
          `Access denied: User with ID ${context.userId} cannot modify notification preferences of user with ID ${notificationId.userId}`
        );

      const removedPreferences =
        await this.notificationPreferenceRepository.delete(notificationId.id);
      return removedPreferences;
    } catch (error) {
      throw new BadRequestException(
        "DeleteNotificationPreferenceUseCase failed",
        error.message
      );
    }
  }
}
