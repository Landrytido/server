import { Injectable } from '@nestjs/common';
import CommentRepository from 'src/Api/Repository/CommentRepository';
import UserRepository from 'src/Api/Repository/UserRepository';
import NoteRepository from 'src/Api/Repository/NoteRepository';
import { ContextualGraphqlRequest } from 'src';
import { Comment } from '@prisma/client'; // Utilisation correcte du modèle Prisma

@Injectable()
export default class FindCommentsByNoteIdUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userRepository: UserRepository,
    private readonly noteRepository: NoteRepository
  ) {}

  async handle(
    _context: ContextualGraphqlRequest,
    noteId: number
  ): Promise<Comment[]> {
    try {
      const comments = await this.commentRepository.findByNoteId(noteId);

      // Retourner un tableau vide si aucun commentaire n'est trouvé
      if (!comments || comments.length === 0) {
        return []; // Pas d'exception, juste un tableau vide
      }

      return Promise.all(comments.map(async (comment) => {
        const user = await this.userRepository.findById(comment.userId);
        const note = await this.noteRepository.findById(comment.noteId);

        // Gestion de l'utilisateur non trouvé
        if (!user) {
          console.warn(`Utilisateur non trouvé pour l'ID : ${comment.userId}`);
        }

        // Gestion de la note non trouvée
        if (!note) {
          console.warn(`Note non trouvée pour l'ID : ${comment.noteId}`);
        }

        return {
          ...comment,
          user: user || null, // Ajoute l'utilisateur comme null si non trouvé
          note: note || null, // Ajoute la note comme null si non trouvée
        } as Comment;
      }));
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des commentaires : ${error.message}`);
    }
  }
}
