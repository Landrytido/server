import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Core/Datasource/Prisma";
import { Prisma } from "@prisma/client";

@Injectable()
export default class SharedNoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findManyByUserId(userId: number) {
    return await this.prisma.sharedNote.findMany({
      where: { sharedBy: userId },
      include: {
        note: {
          include: {
            user: true,
          }
        },
        sharedWith: true,
        sharedByUser: true
      }
    });
  }

  async create(data: Prisma.SharedNoteCreateInput) {
    return await this.prisma.sharedNote.create({ 
      data, 
      include: { note: true, sharedWith: true, sharedByUser: true }, 
    });
  }
  async findBy(params: { noteId: number; sharedWithUserId: number }) {
    return await this.prisma.sharedNote.findFirst({
      where: {
        noteId: params.noteId,
        sharedWithUserId: params.sharedWithUserId
      },
      include: {sharedByUser: true,},
    });
  }

  async delete(id: number) {
    return await this.prisma.sharedNote.delete({
      where: { id }
    });
  }
  
  async deleteAllForNote(noteId: number) {
    return await this.prisma.sharedNote.deleteMany({
      where: { noteId }
    });
  }

  async deleteSharedNotesBetweenUsers(userId1: number, userId2: number) {

    await this.prisma.sharedNote.deleteMany({
      where: {
        OR: [
          {
            sharedBy: userId1,
            sharedWithUserId: userId2
          },

          {
            sharedBy: userId2,
            sharedWithUserId: userId1
          }
        ]
      }
    });
  }
}