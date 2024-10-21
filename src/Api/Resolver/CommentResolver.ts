import { Resolver, Mutation, Query, Args } from '@nestjs/graphql'; 
import { UseGuards } from '@nestjs/common';
import { ContextualRequest } from 'src/Core/Decorator/ContextualRequest';
import GraphqlAuthGuard from 'src/Core/Security/Guard/GraphqlAuthGuard'; 
import UseCaseFactory from '../UseCase/UseCaseFactory'; 
import Comment from '../Entity/Comment'; 
import CommentDto from '../Dto/CommentDto'; 
import CreateCommentUseCase from '../UseCase/Comment/CreateComment/CreateCommentUseCase';
import DeleteCommentUseCase from '../UseCase/Comment/DeleteComment/DeleteCommentUseCase'; 
import UpdateCommentUseCase from '../UseCase/Comment/UpdateComment/UpdateCommentUseCase'; 
import FindCommentsByNoteIdUseCase from '../UseCase/Comment/FindCommentByNoteId/findCommentByNoteIdUseCase'; 
import { ContextualGraphqlRequest } from 'src';

@Resolver(() => Comment)
export default class CommentResolver {
  constructor(private readonly serviceFactory: UseCaseFactory) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Comment)
  async createComment(
    @ContextualRequest() context: ContextualGraphqlRequest, 
    @Args('data') data: CommentDto
  ) {     
    try {
      const createCommentUseCase = await this.serviceFactory.create(CreateCommentUseCase);
      return await createCommentUseCase.handle(context, data);
    } catch (error) {
      throw new Error(`Erreur lors de la création du commentaire : ${error.message}`);
    }
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteComment(
    @ContextualRequest() context: ContextualGraphqlRequest, 
    @Args('commentId', { type: () => Number }) commentId: number
  ) {
    try {
      const deleteCommentUseCase = await this.serviceFactory.create(DeleteCommentUseCase);
      return await deleteCommentUseCase.handle(context, commentId);
    } catch (error) {
      throw new Error(`Erreur lors de la suppression du commentaire : ${error.message}`);
    }
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Comment)
  async updateComment(
    @ContextualRequest() context: ContextualGraphqlRequest, 
    @Args('commentId', { type: () => Number }) commentId: number,
    @Args('data') data: CommentDto
  ) {
    try {
      const updateCommentUseCase = await this.serviceFactory.create(UpdateCommentUseCase);
      return await updateCommentUseCase.handle(context, commentId, data);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du commentaire : ${error.message}`);
    }
  }

  @Query(() => [Comment])
async findCommentsByNoteId(
  @ContextualRequest() context: ContextualGraphqlRequest, 
  @Args('noteId', { type: () => Number }) noteId: number
) {
  try {
    const findCommentsByNoteIdUseCase = await this.serviceFactory.create(FindCommentsByNoteIdUseCase);
    const comments = await findCommentsByNoteIdUseCase.handle(context, noteId);
    
    // Vérifiez si des commentaires ont été trouvés
    if (!comments) {
      return []; // Renvoie un tableau vide si aucun commentaire n'est trouvé
    }
    
    return comments;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des commentaires : ${error.message}`);
  }
}
}