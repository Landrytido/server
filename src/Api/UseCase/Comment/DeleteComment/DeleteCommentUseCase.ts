import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import CommentRepository from "src/Api/Repository/CommentRepository"; 
import { ContextualGraphqlRequest } from 'src'; // Importe correctement le type ContextualGraphqlRequest

@Injectable()
export default class DeleteCommentUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  // Ajoute le contexte comme premier paramètre pour respecter la signature
  async handle(context: ContextualGraphqlRequest, commentId: number): Promise<boolean> {
    try {
      // Vérifier si le commentaire existe
      const comment = await this.commentRepository.findById(commentId);
      
      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      // Supprimer le commentaire
      await this.commentRepository.delete(commentId);

      return true; // Retourner true si la suppression a réussi
    } catch (error) {
      // Gestion des erreurs
      if (!(error instanceof NotFoundException)) {
        throw new BadRequestException({
          message: "DeleteCommentUseCaseFailed",
          originalError: {
            message: error.message,
            error: error.response || 'No additional error details',
            statusCode: 500,
          },
        });
      }
      throw error;
    }
  }
}
