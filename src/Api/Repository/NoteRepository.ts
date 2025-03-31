import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Core/Datasource/Prisma";
import { Prisma } from "@prisma/client";

@Injectable()
export default class NoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(noteId: number) {
    return await this.prisma.note.findUnique({
      where: { id: noteId },
      include: {
        labels: true,
        user: true,
        collaborations: {
          include: {
            note: true, 
            user: true,   
          },
        },
      }, 
    });
  }
  async findNotesByLabel(labelIds: string[], userId: number) {
  if (!labelIds.length) {
    return [];
  }

  

  const result = await this.prisma.note.findMany({
    where: {
      labels: {
        some: {
          id: { in: labelIds },
        },
      },
    },
    include: {
      labels: true,
    },
  });

  
  return result;
}
  async findByUserId(userId: number, orderBy: string = "clickCounter", orderDirection: "asc" | "desc" = "desc") {
    const validFields = ["clickCounter", "createdAt", "updatedAt", "title"];
    if (!validFields.includes(orderBy)) {
      orderBy = "clickCounter";
    }

    return await this.prisma.note.findMany({
      where: { userId },
      orderBy: {
        [orderBy]: orderDirection,
      },
      include: {
        collaborations: true,
        labels: true, 
      },
    });
  }

  async findMany() {
    return await this.prisma.note.findMany({ include: { labels: true } });
  }
  async incrementClickCounter(noteId: number) {
    return await this.prisma.note.update({
      where: { id: noteId },
      data: {
        clickCounter: {
          increment: 1
        }
      },
      include: { labels: true }
    });
  }

  async save(
    data: Prisma.XOR<
      Prisma.NoteCreateInput,
      Prisma.NoteUncheckedCreateInput
    > & { labelIds?: (string | number)[] } |
    Prisma.XOR<
      Prisma.NoteUpdateInput,
      Prisma.NoteUncheckedUpdateInput
    > & { labelIds?: (string | number)[] }
  ) {
    if (!("id" in data)) {
      // Création d'une note
      const createData = data as Prisma.NoteCreateInput & { labelIds?: (string | number)[] };
  
      if (createData.labelIds && createData.labelIds.length > 0) {
        return await this.prisma.note.create({
          data: {
            ...createData,
            labels: {
              connect: createData.labelIds.map((id) => ({ id: String(id) })),
            },
          },
          include: { labels: true },
        });
      } else {
        const defaultLabel = await this.prisma.label.upsert({
          where: { name: "Général" },
          update: {},
          create: { name: "Général" },
        });
  
        return await this.prisma.note.create({
          data: {
            ...createData,
            labels: {
              connect: [{ id: defaultLabel.id }],
            },
          },
          include: { labels: true },
        });
      }
    }
  
    // Mise à jour d'une note
    const { labelIds, ...updateData } = data as Prisma.NoteUpdateInput & { labelIds?: (string | number)[] };
  
    if (labelIds && labelIds.length > 0) {
      return await this.prisma.note.update({
        where: {
          id: data.id as number,
        },
        data: {
          ...updateData,
          labels: {
            set: [], // Supprime les anciens labels
            connect: labelIds.map((id) => ({ id: String(id) })), // Ajoute les nouveaux
          },
        },
        include: { labels: true },
      });
    } else {
      return await this.prisma.note.update({
        where: {
          id: data.id as number,
        },
        data: updateData,
        include: { labels: true },
      });
    }
  }

  async remove(noteId: number) {
    return this.prisma.note.delete({ where: { id: noteId } });
  }
}