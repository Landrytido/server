import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import UseCaseFactory from "../UseCase/UseCaseFactory";
import { ContextualRequest } from "src/Core/Decorator/ContextualRequest";
import { ContextualGraphqlRequest } from "src";
import Notebook from "../Entity/Notebook";
import { UseGuards } from "@nestjs/common";
import GraphqlAuthGuard from "src/Core/Security/Guard/GraphqlAuthGuard";
import DeleteNotebookUseCase from "../UseCase/Notebook/DeleteNotebook/DeleteNotebookUseCase";
import GetNotebookUseCase from "../UseCase/Notebook/GetNotebook/GetNotebookUseCase";
import GetAllNotebooksUseCase from "../UseCase/Notebook/GetAllNotebooks/GetAllNotebooksUseCase";
import SaveNotebookDto from "../Dto/SaveNotebookDto";
import GetNotebooksByUserIdUseCase from "../UseCase/Notebook/GetNotebooksByUserId/GetNotebooksByUserIdUseCase";
import UpdateNotebookUseCase from "../UseCase/Notebook/UpdateNotebook/UpdateNotebookUseCase";
import CreateNotebookUseCase from "../UseCase/Notebook/CreateNotebook/CreateNotebookUseCase";

@Resolver(Notebook)
@UseGuards(GraphqlAuthGuard)
export default class NotebookResolver {
  constructor(private readonly serviceFactory: UseCaseFactory) {}

  @Mutation(() => Notebook)
  async createNotebook(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("dto") dto: SaveNotebookDto
  ): Promise<Notebook> {
    return (await this.serviceFactory.create(CreateNotebookUseCase)).handle(
      context,
      dto
    );
  }

  @Mutation(() => Notebook)
  async updateNotebook(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("notebookId", { type: () => Int }) notebookId: number,
    @Args("dto") dto: SaveNotebookDto
  ): Promise<Notebook> {
    return (await this.serviceFactory.create(UpdateNotebookUseCase)).handle(
      context,
      notebookId,
      dto
    );
  }

  @Mutation(() => Notebook)
  async deleteNotebook(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("notebookId", { type: () => Int }) notebookId: number
  ): Promise<Notebook> {
    return (await this.serviceFactory.create(DeleteNotebookUseCase)).handle(
      context,
      notebookId
    );
  }

  @Query(() => Notebook)
  async findNotebookById(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("notebookId", { type: () => Int }) notebookId: number
  ): Promise<Notebook> {
    return (await this.serviceFactory.create(GetNotebookUseCase)).handle(
      context,
      notebookId
    );
  }

  @Query(() => [Notebook])
  async findNotebooks(
    @ContextualRequest() context: ContextualGraphqlRequest
  ): Promise<Notebook[]> {
    return (await this.serviceFactory.create(GetAllNotebooksUseCase)).handle(
      context
    );
  }

  @Query(() => [Notebook])
  async findNotebooksByUserId(
    @ContextualRequest() context: ContextualGraphqlRequest
  ): Promise<Notebook[]> {
    return (
      await this.serviceFactory.create(GetNotebooksByUserIdUseCase)
    ).handle(context);
  }
}
