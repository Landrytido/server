import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/Core/Datasource/Prisma";

@Injectable()
export default class NotificationPreferenceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(userId: number) {
    const userFound = await this.prisma.notificationPreference.findFirst({
      where: { userId },
    });
    console.log("userfound", userFound);
    return userFound;
  }

  async save(
    data:
      | Prisma.XOR<
          Prisma.NotificationPreferenceCreateInput,
          Prisma.NotificationPreferenceUncheckedCreateInput
        >
      | Prisma.XOR<
          Prisma.NotificationPreferenceUpdateInput,
          Prisma.NotificationPreferenceUncheckedUpdateInput
        >
  ) {
    const existingPreference = await this.findUserById(data.userId as number);
    console.log("existingPreference", existingPreference);

    if (existingPreference) {
      const updatedPreference = await this.prisma.notificationPreference.update(
        {
          where: { id: existingPreference.id as number },
          data: data as Prisma.XOR<
            Prisma.NotificationPreferenceUpdateInput,
            Prisma.NotificationPreferenceUncheckedCreateInput
          >,
        }
      );
      console.log("Notification preference updated", updatedPreference);
      return updatedPreference;
    }

    const createdPreference = await this.prisma.notificationPreference.create({
      data: data as Prisma.XOR<
        Prisma.NotificationPreferenceCreateInput,
        Prisma.NotificationPreferenceUncheckedCreateInput
      >,
    });
    console.log("Notification preference created", createdPreference);
    return createdPreference;
  }

  async findById(preferenceNotificationId: number) {
    const idFound = await this.prisma.notificationPreference.findUnique({
      where: { id: preferenceNotificationId },
    });
    return idFound;
  }

  async delete(preferenceNotificationId: number) {
    const removedPreferences = await this.prisma.notificationPreference.delete({
      where: { id: preferenceNotificationId },
    });
    console.log("removed notification", removedPreferences);
    return removedPreferences;
  }
}
