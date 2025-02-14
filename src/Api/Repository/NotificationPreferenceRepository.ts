import { Injectable } from "@nestjs/common";
import { NotificationType, Prisma, TimeUnit } from "@prisma/client";
import { PrismaService } from "src/Core/Datasource/Prisma";

@Injectable()
export default class NotificationPreferenceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(userId: number) {
    const userFound = await this.prisma.notificationPreference.findFirst({
      where: { userId },
      include: { types: true },
    });
    console.log("userfound", userFound);
    return userFound;
  }

  // async save(
  //   data:
  //     | Prisma.XOR<
  //         Prisma.NotificationPreferenceCreateInput,
  //         Prisma.NotificationPreferenceUncheckedCreateInput
  //       >
  //     | Prisma.XOR<
  //         Prisma.NotificationPreferenceUpdateInput,
  //         Prisma.NotificationPreferenceUncheckedUpdateInput
  //       >
  // ) {
  //   const existingPreference = await this.findUserById(data.userId as number);
  //   console.log("existingPreference", existingPreference);

  //   if (existingPreference) {
  //     const updatedPreference = await this.prisma.notificationPreference.update(
  //       {
  //         where: { id: existingPreference.id as number },
  //         data: data as Prisma.XOR<
  //           Prisma.NotificationPreferenceUpdateInput,
  //           Prisma.NotificationPreferenceUncheckedCreateInput
  //         >,
  //       }
  //     );
  //     console.log("Notification preference updated", updatedPreference);
  //     return updatedPreference;
  //   }

  //   const createdPreference = await this.prisma.notificationPreference.create({
  //     data: data as Prisma.XOR<
  //       Prisma.NotificationPreferenceCreateInput,
  //       Prisma.NotificationPreferenceUncheckedCreateInput
  //     >,
  //   });
  //   console.log("Notification preference created", createdPreference);
  //   return createdPreference;
  // }

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
    console.log("Existing Preference:", existingPreference);

    console.log("data:", data);

    // Transformation des types pour Prisma
    // const typesData = data.types
    //   ? data.types.map((type: NotificationType) => ({ type }))
    //   : [];
    // const typesData = Array.isArray(data.types)
    //   ? data.types.map((type: NotificationType) => ({ type }))
    //   : [];

    // const typesData = Array.isArray(data.types)
    //   ? data.types.map((type: NotificationType) => {
    //       console.log("Transforming type:", type);
    //       return { type }; // Transformation des objets
    //     })
    //   : [];

    const typesData = Array.isArray(data.types.create) ? data.types.create : [];

    console.log("typesData dans repo :", typesData);
    console.log("data.types : ", data.types);

    // const typesData = (data as any).types
    //   ? {
    //       create: (data as any).types.map((type: NotificationType) => ({
    //         type,
    //       })),
    //     }
    //   : undefined;

    // // Vérification et formatage des relations
    // const taskData = (data as any).tasks
    //   ? {
    //       connect: (data as any).tasks.map((taskId: number) => ({
    //         id: taskId,
    //       })),
    //     }
    //   : undefined;
    // const eventData = (data as any).events
    //   ? {
    //       connect: (data as any).events.map((eventId: number) => ({
    //         id: eventId,
    //       })),
    //     }
    //   : undefined;
    // const meetingData = (data as any).meetings
    //   ? {
    //       connect: (data as any).meetings.map((meetingId: number) => ({
    //         id: meetingId,
    //       })),
    //     }
    //   : undefined;

    if (existingPreference) {
      const updatedPreference = await this.prisma.notificationPreference.update(
        {
          where: { id: existingPreference.id },
          data: {
            ...data,
            types: {
              deleteMany: {},
              create: typesData, // Ajoute les nouvelles préférences
            },
          },
          include: { types: true }, // Récupérer les types après la mise à jour
        }
      );
      console.log("Notification preference updated", updatedPreference);
      return updatedPreference;
    }

    const createdPreference = await this.prisma.notificationPreference.create({
      data: {
        ...data,
        types: {
          create: typesData,
        },
      } as any,
      include: { types: true },
    });
    console.log("Notification preference created", createdPreference);
    return createdPreference;

    // if (existingPreference) {
    //   const updatedPreference = await this.prisma.notificationPreference.update(
    //     {
    //       where: { id: existingPreference.id },
    //       data: {
    //         timeBefore: data.timeBefore,
    //         timeUnit: data.timeUnit,
    //         types: typesData, // ✅ Ajout des types
    //         tasks: taskData, // ✅ Ajout des tâches si elles existent
    //         events: eventData, // ✅ Ajout des événements
    //         meetings: meetingData, // ✅ Ajout des réunions
    //       },
    //       include: { types: true }, // Pour récupérer les types après la mise à jour
    //     }
    //   );

    //   console.log("Notification preference updated", updatedPreference);
    //   return updatedPreference;
    // }

    // // Création si elle n'existe pas
    // const createdPreference = await this.prisma.notificationPreference.create({
    //   data: {
    //     userId: data.userId as number,
    //     timeBefore: data.timeBefore as number,
    //     timeUnit: data.timeUnit as TimeUnit,
    //     types: typesData,
    //     tasks: taskData,
    //     events: eventData,
    //     meetings: meetingData,
    //   },
    //   include: { types: true },
    // });

    // console.log("Notification preference created", createdPreference);
    // return createdPreference;
  }

  async findById(preferenceNotificationId: number) {
    const idFound = await this.prisma.notificationPreference.findUnique({
      where: { id: preferenceNotificationId },
      include: { types: true },
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
