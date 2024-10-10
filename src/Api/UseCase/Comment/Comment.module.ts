import { Module } from '@nestjs/common';
import CommentResolver from '../../Resolver/CommentResolver';
import CreateCommentUseCase from './CreateComment/CreateCommentUseCase'; // Assurez-vous que le chemin est correct
import UseCaseFactory from '../../usecase/UseCaseFactory';



@Module({
  providers: [
    CommentResolver, // Utilisez ici l'importation par défaut
    CreateCommentUseCase,
    UseCaseFactory,
    
  ],
  exports: [CommentResolver], // Exportez le resolver si nécessaire
})
export default class CommentModule {}