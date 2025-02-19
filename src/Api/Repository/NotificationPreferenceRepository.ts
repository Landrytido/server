import {Injectable} from "@nestjs/common";
import {Prisma} from "@prisma/client";
import {PrismaService} from "src/Core/Datasource/Prisma";

@Injectable()
export default class NotificationPreferenceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(userId: number) {
    return this.prisma.notificationPreference.findFirst({
      where: {userId},
      include: {types: true},
    });
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
    const typesData = Array.isArray(data.types.create) ? data.types.create : [];

    if (existingPreference) {
      return this.prisma.notificationPreference.update(
            {
              where: {id: existingPreference.id},
              data: {
                ...data,
                types: {
                  deleteMany: {},
                  create: typesData, // Ajoute les nouvelles préférences
                },
              },
              include: {types: true}, // Récupérer les types après la mise à jour
            }
      );
    }

    return this.prisma.notificationPreference.create({
      data: {
        ...data,
        types: {
          create: typesData,
        },
      } as any,
      include: {types: true},
    });
  }

  async findById(preferenceNotificationId: number) {
    return this.prisma.notificationPreference.findUnique({
      where: {id: preferenceNotificationId},
      include: {types: true},
    });
  }

  async delete(preferenceNotificationId: number) {
    return this.prisma.notificationPreference.delete({
      where: {id: preferenceNotificationId},
    });
  }
}
