import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Core/Datasource/Prisma";
import { Notebook, Prisma } from "@prisma/client";

@Injectable()
export default class NotebookRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(notebookId: number) {
    return await this.prisma.notebook.findUnique({
      where: { id: notebookId },
      include: { user: true },
    });
  }

  async findByUserId(userId: number) {
    return await this.prisma.notebook.findMany({
      where: { userId },
      include: { user: true },
    });
  }

  async findMany() {
    return await this.prisma.notebook.findMany({
      include: { user: true },
    });
  }

  async save(
    data:
      | Prisma.XOR<
          Prisma.NotebookCreateInput,
          Prisma.NotebookUncheckedCreateInput
        >
      | Prisma.XOR<
          Prisma.NotebookUpdateInput,
          Prisma.NotebookUncheckedUpdateInput
        >
  ) {
    if (!data.id) {
      return await this.prisma.notebook.create({
        data: data as Prisma.XOR<
          Prisma.NotebookCreateInput,
          Prisma.NotebookUncheckedCreateInput
        >,
      });
    }

    return await this.prisma.notebook.update({
      where: {
        id: data.id as number,
      },
      data: data as Prisma.XOR<
        Prisma.NotebookUpdateInput,
        Prisma.NotebookUncheckedUpdateInput
      >,
    });
  }

  async remove(notebookId: number) {
    return this.prisma.notebook.delete({ where: { id: +notebookId } });
  }
}
