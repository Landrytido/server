import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/Core/Datasource/Prisma";

// TODO: Remove this model after refactoring tasks, events, meetings into CalendarEvent ❌
@Injectable()
export default class TaskRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findByUserId(userId: number) {
    return await this.prisma.task.findMany({
      where: { userId: userId },
      include: { user: true },
    });
  }
  async findById(taskId: number) {
    return await this.prisma.task.findUnique({
      where: { id: taskId },
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

  async RemoveById(taskId: number) {
    return await this.prisma.task.delete({
      where: { id: taskId },
    });
  }

  //asupp si le findmany du bas ok
  // async findAllTask(){
  //   return await this.prisma.task.findMany()
  // }
  //asupp

  async findAllTask() {
    return await this.prisma.task.findMany({
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

  async save(
    data:
      | Prisma.XOR<Prisma.TaskCreateInput, Prisma.TaskUncheckedCreateInput>
      | Prisma.XOR<Prisma.TaskUpdateInput, Prisma.TaskUncheckedUpdateInput>,
  ) {
    if (!data.id) {
      return await this.prisma.task.create({
        data: data as Prisma.XOR<
          Prisma.TaskCreateInput,
          Prisma.TaskUncheckedCreateInput
        >,
      });
    }

    return await this.prisma.task.update({
      where: {
        id: data.id as number,
      },
      data: data as Prisma.XOR<
        Prisma.TaskUpdateInput,
        Prisma.TaskUncheckedUpdateInput
      >,
    });
  }

  //a supp si marche pas
  async markNotificationAsSent(meetingId: number) {
    await this.prisma.task.update({
      where: { id: meetingId },
      data: { notificationSent: true },
    });
  }

  async findByToken(token: string) {
    return this.prisma.task.findUnique({
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
  //asupp
}
