import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/Core/Datasource/Prisma";
import { Prisma } from "@prisma/client";

@Injectable()
export default class CommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Récupérer un commentaire par ID, avec l'utilisateur associé
  async findById(commentId: number) {
    return await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        user: true, // Inclure l'utilisateur lié au commentaire
      },
    });
  }

  // Récupérer les commentaires liés à une note par son ID, avec les utilisateurs associés
  async findByNoteId(noteId: number) {
    return await this.prisma.comment.findMany({
      where: { noteId },
      include: {
        user: true, // Inclure l'utilisateur pour chaque commentaire
        note: true,  // Inclure la note associée à chaque commentaire
      },
    });
  }



  // Récupérer les commentaires d'un utilisateur spécifique par son ID
  async findByUserId(userId: number) {
    return await this.prisma.comment.findMany({
      where: { userId },
      include: {
        user: true, // Inclure l'utilisateur pour chaque commentaire
      },
    });
  }

  // Récupérer tous les commentaires avec les utilisateurs associés
  async findMany() {
    return await this.prisma.comment.findMany({
      include: {
        user: true, // Inclure l'utilisateur pour tous les commentaires
      },
    });
  }

  // Sauvegarder un commentaire (créer ou mettre à jour)
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

  // Supprimer un commentaire par son ID
  async delete(commentId: number) {
    return await this.prisma.comment.delete({
      where: { id: commentId },
    });
  }

  // Nouvelle méthode pour mettre à jour le contenu d'un commentaire
  async update(commentId: number, content: string) {
    return await this.prisma.comment.update({
      where: { id: commentId },
      data: { content }, // Mettre à jour uniquement le contenu du commentaire
    });
  }
}
