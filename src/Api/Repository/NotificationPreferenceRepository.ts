import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/Core/Datasource/Prisma";

@Injectable()
export default class NotificationPreferenceRepository {
  constructor(private readonly prisma: PrismaService) {}

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
    if (!data.id) {
      const createdPreferences = this.prisma.notificationPreference.create({
        data: data as Prisma.XOR<
          Prisma.NotificationPreferenceCreateInput,
          Prisma.NotificationPreferenceUncheckedCreateInput
        >,
      });
      console.log("notifpref", createdPreferences); //à supp
      return createdPreferences;
    }
  }
}
