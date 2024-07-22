import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Core/Datasource/Prisma";
import InsufficientPermissionException from "src/Core/Exception/InsufficientPermissionException";
import SaveNotebookDto from "../Dto/SaveNotebookDto";
import Notebook from "../Entity/Notebook";

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

  async create(userId: number, dto: SaveNotebookDto): Promise<Notebook> {
    return await this.prisma.notebook.create({
      data: { title: dto.title, userId: userId },
    });
  }

  async remove(notebookId: number, userId: number): Promise<Notebook> {
    const notebook = await this.prisma.notebook.findUnique({
      where: { id: notebookId },
    });

    if (notebook.userId !== userId) throw new InsufficientPermissionException();

    return this.prisma.notebook.delete({ where: { id: +notebookId } });
  }

  async update(
    userId: number,
    notebookId: number,
    dto: SaveNotebookDto
  ): Promise<Notebook> {
    const notebook = await this.prisma.notebook.findUnique({
      where: { id: notebookId },
    });

    if (notebook.userId !== userId) throw new InsufficientPermissionException();

    return await this.prisma.notebook.update({
      where: { id: notebookId },
      data: { title: dto.title },
    });
  }
}
