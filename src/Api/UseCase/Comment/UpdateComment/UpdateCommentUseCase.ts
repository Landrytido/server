import { ContextualGraphqlRequest, UseCase } from "src";
import { BadRequestException, Injectable } from "@nestjs/common";
import CommentRepository from "src/Api/Repository/CommentRepository";
import CommentDto from "src/Api/Dto/CommentDto"; // Assurez-vous que CommentDto contient la propriété 'content'
import { Comment } from "@prisma/client";

@Injectable()
export default class UpdateCommentUseCase implements UseCase<Promise<Comment>, [number, CommentDto]> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    commentId: number,
    data: CommentDto // Changez ici pour accepter le CommentDto
  ): Promise<Comment> {
    try {
      if (!context.userId) {
        throw new BadRequestException('User not authenticated');
      }

      // Vérifiez si le commentaire existe
      const existingComment = await this.commentRepository.findById(commentId);
      if (!existingComment) {
        throw new BadRequestException('Comment not found');
      }

      // Mettre à jour le commentaire
      const updatedComment = await this.commentRepository.save({
        id: commentId, // Assurez-vous d'inclure l'ID du commentaire
        content: data.content, // Utilisez le contenu du CommentDto
      });

      return updatedComment; // Pas besoin de rechercher à nouveau le commentaire

    } catch (error) {
      if (!(error instanceof BadRequestException)) {
        const structuredError = {
          message: "UpdateCommentUseCaseFailed",
          originalError: {
            message: error.message,
            error: error.response || 'No additional error details',
            statusCode: 500,
          },
          stacktrace: error.stack?.split('\n').map(line => line.trim()),
        };

        throw new BadRequestException(structuredError);
      }

      throw error;
    }
  }
}
