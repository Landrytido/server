import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { NotificationRepository } from '../Repository/NotificationRepository';
import { AdditionalDataInput } from '../Dto/DeviceDto';

@Resolver()
export class NotificationResolver {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  @Mutation(() => Boolean)
  async sendNotification(
    @Args('userId') userId: number,
    @Args('message') message: string,
    @Args('additionalData', { nullable: true }) additionalData: AdditionalDataInput,
  ) {
    try {
      await this.notificationRepository.sendPushNotification(userId, message, additionalData);
      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }
}
