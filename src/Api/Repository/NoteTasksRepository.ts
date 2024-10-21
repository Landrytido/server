import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { log } from "console";
import { PrismaService } from "src/Core/Datasource/Prisma";

@Injectable()
export default class NoteTaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: number) {
    return await this.prisma.noteTask.findMany({
      where : {id: userId}
    });
   
    
  }
  

  async findById(noteTaskId: number) {
    return await this.prisma.noteTask.findUnique({
      where: { id: noteTaskId },
    });
  }

  async RemoveById(noteTaskId: number) {
    return await this.prisma.noteTask.delete({
      where: { id: noteTaskId },
    });
  }

  async findAllNoteTask() {
    return await this.prisma.noteTask.findMany();
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
    if (!data.id) {
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
