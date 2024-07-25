import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Core/Datasource/Prisma";
import { Note, Prisma } from "@prisma/client";

@Injectable()
export default class NoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(noteId: number): Promise<Note> {
    return await this.prisma.note.findUnique({
      where: { id: noteId },
    });
  }

  async findByUserId(userId: number): Promise<Note[]> {
    return await this.prisma.note.findMany({
      where: { userId },
    });
  }

  async findMany(): Promise<Note[]> {
    return await this.prisma.note.findMany();
  }

  async save(
    userId: number,
    data:
      | Prisma.XOR<Prisma.NoteCreateInput, Prisma.NoteUncheckedCreateInput>
      | Prisma.XOR<Prisma.NoteUpdateInput, Prisma.NoteUncheckedUpdateInput>
  ): Promise<Note> {
    if (!data.id) {
      return await this.prisma.note.create({
        data: {
          title: data.title as string,
          content: data.content as string,
          notebookId: data.notebookId as number,
          userId: userId,
        },
      });
    }

    return await this.prisma.note.update({
      where: {
        id: data.id as number,
      },
      data: {
        title: data.title as string,
        content: data.content as string,
        notebookId: data.notebookId as number,
      },
    });
  }

  async remove(noteId: number, userId: number): Promise<Note> {
    return this.prisma.note.delete({ where: { id: noteId } });
  }
}
