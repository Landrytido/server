// src/Api/UseCase/Comment/CommentService.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import CommentDto from '../../Dto/CommentDto'; // Assurez-vous que le chemin est correct
import Comment from '../../Entity/Comment'; // Assurez-vous que le chemin est correct
import CommentRepository from '../../Repository/CommentRepository'; // Assurez-vous que le chemin est correct
import UserRepository from '../../Repository/UserRepository'; // Ajoutez si nécessaire
import NoteRepository from '../../Repository/NoteRepository'; // Ajoutez si nécessaire

@Injectable()
export default class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userRepository: UserRepository, // Ajoutez si nécessaire
    private readonly noteRepository: NoteRepository // Ajoutez si nécessaire
  ) {}

  // Méthode pour créer un commentaire
  async createComment(createCommentInput: CommentDto, userId: number): Promise<Comment> {
    const newCommentData = {
      content: createCommentInput.content,
      noteId: Number(createCommentInput.noteId), // Assurez-vous de le convertir en nombre
      userId: userId, // Utiliser l'ID de l'utilisateur authentifié
      createdAt: new Date(),
    };

    const newComment = await this.commentRepository.save(newCommentData);

     // Récupérez l'utilisateur et la note associés
    const user = await this.userRepository.findById(newComment.userId);
    const note = await this.noteRepository.findById(newComment.noteId);

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (!note) {
      throw new NotFoundException('Note non trouvée');
    }

    // Ajoutez les propriétés manquantes à l'objet Comment
    return {
      ...newComment,
      user: user,
      note: { // Reconstruire l'objet note pour s'assurer des types
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        userId: note.userId,
        notebookId: note.notebookId,
        labels: note.labels,
        user: note.user,
        collaborations: note.collaborations as any, // Assertion de type ici si nécessaire
      },
    } as Comment;
  }

  async deleteComment(id: number): Promise<boolean> {
    try {
      const comment = await this.commentRepository.findById(id);

       // Vérifier si le commentaire existe avant de le supprimer
      if (!comment) {
        throw new NotFoundException('Commentaire non trouvé');
      }

      // Suppression du commentaire
      await this.commentRepository.delete(id);

      return true; // Retourne true si la suppression a réussi
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
      return false; // Retourne false si la suppression a échoué
    }
  }

  // Méthode pour mettre à jour un commentaire
  async updateComment(commentId: number, updateCommentInput: CommentDto, userId: number): Promise<Comment> {
     // Vérifiez si l'utilisateur est authentifié et a le droit de mettre à jour le commentaire
    if (!userId) {
      throw new BadRequestException('Utilisateur non authentifié');
    }

    const existingComment = await this.commentRepository.findById(commentId);
    if (!existingComment) {
      throw new NotFoundException('Commentaire non trouvé');
    }

    // Préparez les données à mettre à jour
    const updatedCommentData = {
      id: commentId,
      content: updateCommentInput.content,
      noteId: Number(updateCommentInput.noteId), // Assurez-vous de le convertir en nombre
      userId: existingComment.userId, // Conserver l'ID de l'utilisateur existant
      updatedAt: new Date(), // Mettez à jour la date de modification
    };

     // Enregistrez le commentaire mis à jour
    const updatedComment = await this.commentRepository.save(updatedCommentData);

    // Récupérez l'utilisateur et la note associés
    const user = await this.userRepository.findById(updatedComment.userId);
    const note = await this.noteRepository.findById(updatedComment.noteId);

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (!note) {
      throw new NotFoundException('Note non trouvée');
    }

    return {
      ...updatedComment,
      user: user,
      note: { // Reconstruire l'objet note
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        userId: note.userId,
        notebookId: note.notebookId,
        labels: note.labels,
        user: note.user,
        collaborations: note.collaborations as any, // Assertion de type ici si nécessaire
      },
    } as Comment;
  }

  async findCommentsByNoteId(noteId: number): Promise<Comment[]> {
    if (!noteId) {
      throw new BadRequestException('L\'ID de la note est requis');
    }

    const comments = await this.commentRepository.findByNoteId(noteId);

    if (!comments || comments.length === 0) {
      throw new NotFoundException('Aucun commentaire trouvé pour cet ID de note');
    }

    // Transformez les commentaires pour inclure les utilisateurs et les notes
    return Promise.all(comments.map(async (comment) => {
      const user = await this.userRepository.findById(comment.userId);
      const note = await this.noteRepository.findById(comment.noteId);

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      if (!note) {
        throw new NotFoundException('Note non trouvée');
      }

      return {
        ...comment,
        user: user,
        note: { // Reconstruire l'objet note
          id: note.id,
          title: note.title,
          content: note.content,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
          userId: note.userId,
          notebookId: note.notebookId,
          labels: note.labels,
          user: note.user,
          collaborations: note.collaborations as any, // Assertion de type ici si nécessaire
        },
      } as Comment;
    }));
  }
}
