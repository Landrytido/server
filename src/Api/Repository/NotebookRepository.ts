import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Core/Datasource/Prisma";
import Notebook from "../Entity/Notebook";
import { Prisma } from "@prisma/client";

@Injectable()
export default class NotebookRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(notebookId: number): Promise<Notebook> {
    return await this.prisma.notebook.findUnique({
      where: { id: notebookId },
      include: { user: true },
    });
  }

  async findByUserId(userId: number): Promise<Notebook[]> {
    return await this.prisma.notebook.findMany({
      where: { userId },
      include: { user: true },
    });
  }

  async findMany(): Promise<Notebook[]> {
    return await this.prisma.notebook.findMany({
      include: { user: true },
    });
  }

  async save(
    userId: number,
    data:
      | Prisma.XOR<
          Prisma.NotebookCreateInput,
          Prisma.NotebookUncheckedCreateInput
        >
      | Prisma.XOR<
          Prisma.NotebookUpdateInput,
          Prisma.NotebookUncheckedUpdateInput
        >
  ): Promise<Notebook> {
    if (!data.id) {
      return await this.prisma.notebook.create({
        data: {
          title: data.title as string,
          userId: userId,
        },
      });
    }

    return await this.prisma.notebook.update({
      where: {
        id: data.id as number,
      },
      data: {
        title: data.title as string,
      },
    });
  }

  async remove(notebookId: number, userId: number): Promise<Notebook> {
    return this.prisma.notebook.delete({ where: { id: +notebookId } });
  }
}
