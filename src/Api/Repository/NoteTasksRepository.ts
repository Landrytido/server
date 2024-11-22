import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/Core/Datasource/Prisma";

@Injectable()
export default class NoteTaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: number) {
    return await this.prisma.noteTask.findMany({
      where: { userId: userId },
      include: {
        subtasks: true, 
      },
    });
  }

  async findByUserIdAndNoteId(userId: number, noteId: number) {
    return await this.prisma.noteTask.findMany({
      where: {
        userId: userId,
        noteId: noteId,
        parentId: null, 
      },
      include: {
        subtasks: true, 
      },
    });
  }

  async findById(noteTaskId: number) {
    return await this.prisma.noteTask.findUnique({
      where: { id: noteTaskId },
      include: {
        subtasks: true, 
      },
    });
  }
  async updateSubtasksCompletion(parentId: number, completed: boolean) {
    return await this.prisma.noteTask.updateMany({
      where: { parentId },
      data: { completed },
    });
  }

  async findSubtasks(parentId: number) {
    return await this.prisma.noteTask.findMany({
      where: { parentId: parentId },
      include: {
        subtasks: true, 
      },
    });
  }

  async removeById(noteTaskId: number) {
   
    await this.prisma.noteTask.deleteMany({
      where: { parentId: noteTaskId },
    });

    return await this.prisma.noteTask.delete({
      where: { id: noteTaskId },
    });
  }

  async findAllNoteTask() {
    return await this.prisma.noteTask.findMany({
      include: {
        subtasks: true, 
      },
    });
  }

  async save(
    data:
      | Prisma.XOR<
          Prisma.NoteTaskCreateInput,
          Prisma.NoteTaskUncheckedCreateInput
        >
      | Prisma.XOR<
          Prisma.NoteTaskUpdateInput,
          Prisma.NoteTaskUncheckedUpdateInput
        >
  ) {
    if (!('id' in data && data.id !== undefined)) {
      
      return await this.prisma.noteTask.create({
        data: data as Prisma.XOR<
          Prisma.NoteTaskCreateInput,
          Prisma.NoteTaskUncheckedCreateInput
        >,
      });
    }
    return await this.prisma.noteTask.update({
      where: {
        id: data.id as number,
      },
      data: data as Prisma.XOR<
        Prisma.NoteTaskUpdateInput,
        Prisma.NoteTaskUncheckedUpdateInput
      >,
    });
  }
}
