import { Resolver, Mutation, Args } from '@nestjs/graphql'; 
import { UseGuards } from '@nestjs/common';
import { ContextualRequest } from 'src/Core/Decorator/ContextualRequest'; // Pour récupérer le contexte personnalisé
import GraphqlAuthGuard from 'src/Core/Security/Guard/GraphqlAuthGuard'; // Si vous avez une authentification
import UseCaseFactory from '../UseCase/UseCaseFactory';
import Comment from '../Entity/Comment'; // L'entité Comment
import CommentDto  from '../Dto/CommentDto'; // Le DTO pour créer un commentaire
import CreateCommentUseCase from '../UseCase/Comment/CreateComment/CreateCommentUseCase';
import { ContextualGraphqlRequest } from 'src';

@Resolver(() => Comment)
export default class CommentResolver {
  constructor(private readonly serviceFactory: UseCaseFactory) {}

  // Protection par le garde d'authentification
  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Comment)
  async createComment(
    @ContextualRequest() context: ContextualGraphqlRequest, 
    @Args('data') data: CommentDto
  ) {     
    const createCommentUseCase = await this.serviceFactory.create(CreateCommentUseCase);
    return await createCommentUseCase.handle(context, data);
  }
}
