import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../Core/Datasource/Prisma";
import { Prisma } from "@prisma/client";

@Injectable()
export default class EventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.event.findUnique({
      where: { id },
    });
  }

  async saveEvent(
    data:
      | Prisma.XOR<Prisma.EventCreateInput, Prisma.EventUncheckedCreateInput>
      | Prisma.XOR<Prisma.EventUpdateInput, Prisma.EventUncheckedUpdateInput>
  ) {
    if (!data.id) {
      return this.prisma.event.create({
        data: data as Prisma.XOR<
          Prisma.EventCreateInput,
          Prisma.EventUncheckedCreateInput
        >,
      });
    }

    return this.prisma.event.update({
      where: { id: data.id as number },
      data: data as Prisma.XOR<
        Prisma.EventUpdateInput,
        Prisma.EventUncheckedUpdateInput
      >,
    });
  }

  async delete(id: number) {
    return this.prisma.event.delete({
      where: { id },
    });
  }
  //Asupprimer si tout ok
  // async findAll() {
  //   return this.prisma.event.findMany();
  // }
  //Asupp

  async findAll() {
    return this.prisma.event.findMany({
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        notificationPreference: {
          select: {
            id: true,
            type: true,
            timeBefore: true,
            timeUnit: true,
          },
        },
      },
    });
  }

  //asupp si ça marche pas
  async markNotificationAsSent(eventId: number) {
    await this.prisma.event.update({
      where: { id: eventId },
      data: { notificationSent: true },
    });
  }

  async findByToken(token: string) {
    return this.prisma.event.findUnique({
      where: { token },
    });
  }

  //asupp

  async findByUserId(userId: number) {
    return this.prisma.event.findMany({
      where: { userId: userId },
    });
  }
}
