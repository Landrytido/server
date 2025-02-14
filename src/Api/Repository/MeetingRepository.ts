import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../Core/Datasource/Prisma";
import { Prisma } from "@prisma/client";

@Injectable()
export default class MeetingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.meeting.findUnique({
      where: { id },
      include: {
        notificationPreference: {
          select: {
            id: true,
            timeBefore: true,
            timeUnit: true,
            types: true,
          },
        },
      },
    });
  }

  async saveMeeting(
    data:
      | Prisma.XOR<
          Prisma.MeetingCreateInput,
          Prisma.MeetingUncheckedCreateInput
        >
      | Prisma.XOR<
          Prisma.MeetingUpdateInput,
          Prisma.MeetingUncheckedUpdateInput
        >
  ) {
    if (!data.id) {
      return this.prisma.meeting.create({
        data: data as Prisma.XOR<
          Prisma.MeetingCreateInput,
          Prisma.MeetingUncheckedCreateInput
        >,
      });
    }

    return this.prisma.meeting.update({
      where: { id: data.id as number },
      data: data as Prisma.XOR<
        Prisma.MeetingUpdateInput,
        Prisma.MeetingUncheckedUpdateInput
      >,
    });
  }

  async delete(id: number) {
    return this.prisma.meeting.delete({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.meeting.findMany({
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
            types: true,
            timeBefore: true,
            timeUnit: true,
          },
        },
      },
    });
  }

  async markNotificationAsSent(meetingId: number) {
    await this.prisma.meeting.update({
      where: { id: meetingId },
      data: { notificationSent: true },
    });
  }

  async findByToken(token: string) {
    return this.prisma.meeting.findUnique({
      where: { token },
      include: {
        notificationPreference: {
          select: {
            id: true,
            timeBefore: true,
            timeUnit: true,
            types: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.meeting.findMany({
      where: { userId: userId },
    });
  }
}
