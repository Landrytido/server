import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Core/Datasource/Prisma";
import { Prisma } from "@prisma/client";

@Injectable()
export default class NoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(noteId: number) {
    return await this.prisma.note.findUnique({
      where: { id: noteId },
    });
  }

  async findByUserId(userId: number) {
    return await this.prisma.note.findMany({
      where: { userId },
      include: {
        collaborations: true,
      },
    });
  }

  async findMany() {
    return await this.prisma.note.findMany();
  }

  async save(
    data:
      | Prisma.XOR<Prisma.NoteCreateInput, Prisma.NoteUncheckedCreateInput>
      | Prisma.XOR<Prisma.NoteUpdateInput, Prisma.NoteUncheckedUpdateInput>
  ) {
    if (!data.id) {
      return await this.prisma.note.create({
        data: data as Prisma.XOR<
          Prisma.NoteCreateInput,
          Prisma.NoteUncheckedCreateInput
        >,
      });
    }

    return await this.prisma.note.update({
      where: {
        id: data.id as number,
      },
      data: data as Prisma.XOR<
        Prisma.NoteUpdateInput,
        Prisma.NoteUncheckedUpdateInput
      >,
    });
  }

  async remove(noteId: number) {
    return this.prisma.note.delete({ where: { id: noteId } });
  }
}
