import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/Core/Datasource/Prisma";

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
    });
  }

  async RemoveById(taskId: number) {
    return await this.prisma.task.delete({
      where: { id: taskId },
    });
  }

  async findAllTask(){
    return await this.prisma.task.findMany()
  }

  async save(
    data:
      | Prisma.XOR<Prisma.TaskCreateInput, Prisma.TaskUncheckedCreateInput>
      | Prisma.XOR<Prisma.TaskUpdateInput, Prisma.TaskUncheckedUpdateInput>
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
}
