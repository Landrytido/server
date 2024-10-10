import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Core/Datasource/Prisma";
import { Prisma } from "@prisma/client";

@Injectable()
export default class CommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Inclure l'utilisateur lors de la récupération d'un commentaire par ID
  async findById(commentId: number) {
    return await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        user: true, // Inclut l'utilisateur lié au commentaire
      },
    });
  }

  async findByNoteId(noteId: number) {
    return await this.prisma.comment.findMany({
      where: { noteId },
      include: {
        user: true, // Inclut également l'utilisateur pour chaque commentaire
      },
    });
  }

  async findByUserId(userId: number) {
    return await this.prisma.comment.findMany({
      where: { userId },
      include: {
        user: true, // Inclut l'utilisateur pour les commentaires de cet utilisateur
      },
    });
  }

  async findMany() {
    return await this.prisma.comment.findMany({
      include: {
        user: true, // Inclut l'utilisateur pour tous les commentaires
      },
    });
  }

  async save(
    data:
      | Prisma.XOR<Prisma.CommentCreateInput, Prisma.CommentUncheckedCreateInput>
      | Prisma.XOR<Prisma.CommentUpdateInput, Prisma.CommentUncheckedUpdateInput>
  ) {
    if (!data.id) {
      return await this.prisma.comment.create({
        data: data as Prisma.XOR<
          Prisma.CommentCreateInput,
          Prisma.CommentUncheckedCreateInput
        >,
      });
    }

    return await this.prisma.comment.update({
      where: {
        id: data.id as number,
      },
      data: data as Prisma.XOR<
        Prisma.CommentUpdateInput,
        Prisma.CommentUncheckedUpdateInput
      >,
    });
  }

  async remove(commentId: number) {
    return this.prisma.comment.delete({ where: { id: commentId } });
  }
}
