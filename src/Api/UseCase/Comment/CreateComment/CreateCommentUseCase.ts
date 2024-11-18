import { ContextualGraphqlRequest, UseCase } from "src"; 
import { BadRequestException, Injectable } from "@nestjs/common"; 
import CommentRepository from "src/Api/Repository/CommentRepository"; 
import CommentDto from "src/Api/Dto/CommentDto"; 
import { Comment } from "@prisma/client"; 

@Injectable() 
export default class CreateCommentUseCase implements UseCase<Promise<Comment>, [CommentDto]> { 
  constructor(private readonly commentRepository: CommentRepository) {}

  async handle(
    context: ContextualGraphqlRequest, 
    dto: CommentDto
  ): Promise<Comment> {
    try {    
      
      if (!context.userId) {
        throw new BadRequestException('User not authenticated');
      }

      
      if (!dto.content || !dto.noteId) {
        throw new BadRequestException('Content and noteId are required');
      }

      // Enregistrement du commentaire
      const savedComment = await this.commentRepository.save({
        content: dto.content,
        noteId: Number(dto.noteId),
        userId: Number(context.userId), // Utilisez context.userId pour obtenir l'ID de l'utilisateur
      });

      // Inclure l'utilisateur associé dans la réponse
      const commentWithUser = await this.commentRepository.findById(savedComment.id);

      if (!commentWithUser) {
        throw new BadRequestException('Comment not found after saving');
      }

      return commentWithUser;

    } catch (error) {
      if (!(error instanceof BadRequestException)) {
        const structuredError = {
          message: "CreateCommentUseCaseFailed",
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
