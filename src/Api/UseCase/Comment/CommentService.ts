import { Injectable } from '@nestjs/common';
import  CommentDto  from '../../Dto/CommentDto'; // Assurez-vous que le chemin est correct
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

  async createComment(createCommentInput: CommentDto): Promise<Comment> {
    const newCommentData = {
      content: createCommentInput.content,
      noteId: Number(createCommentInput.noteId), // Assurez-vous de le convertir en nombre
      userId: 1, // Remplacez par l'ID de l'utilisateur actuel
      createdAt: new Date(),
    };

    const newComment = await this.commentRepository.save(newCommentData);

    // Récupérez l'utilisateur et la note associés
    const user = await this.userRepository.findById(newComment.userId);
    const note = await this.noteRepository.findById(newComment.noteId);

    // Ajoutez les propriétés manquantes à l'objet Comment
    return {
      ...newComment,
      user: user, // Assurez-vous que l'utilisateur existe
      note: note, // Assurez-vous que la note existe
    } as Comment; // Vous pouvez forcer le type ici, mais assurez-vous que c'est correct
  }

  // Ajoutez d'autres méthodes de service ici
}
