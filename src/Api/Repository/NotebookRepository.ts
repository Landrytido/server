import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Core/Datasource/Prisma";
import { Notebook } from "@prisma/client";
import InsufficientPermissionException from "src/Core/Exception/InsufficientPermissionException";
import SaveNotebookDto from "../Dto/SaveNotebookDto";

@Injectable()
export default class NotebookRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find a notebook
   * @param notebookId
   */
  async findById(notebookId: number): Promise<Notebook> {
    return await this.prisma.notebook.findUnique({
      where: { id: notebookId },
      include: { user: true },
    });
  }

  async findMany(): Promise<Notebook[]> {
    return await this.prisma.notebook.findMany({
      include: {
        user: true,
      },
    });
  }

  /**
   * Create a notebook
   * @param dto
   * @param context
   * @returns
   */
  async create(userId: number, dto: SaveNotebookDto): Promise<Notebook> {
    return await this.prisma.notebook.create({
      data: { title: dto.title, userId: userId },
    });
  }

  /**
   * Remove a notebook
   * @param id
   * @returns
   */
  async remove(notebookId: number, userId: number): Promise<Notebook> {
    // Find the notebook in the database
    const notebook = await this.prisma.notebook.findUnique({
      where: { id: notebookId },
    });

    // If the signed in user is not the owner of the notebook, he can't delete it
    if (notebook.userId !== userId) throw new InsufficientPermissionException();

    return this.prisma.notebook.delete({ where: { id: +notebookId } });
  }

  /**
   * Update a notebook
   * @param dto
   * @param context
   * @param notebookId
   */
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
