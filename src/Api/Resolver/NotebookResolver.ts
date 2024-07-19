import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import UseCaseFactory from "../UseCase/UseCaseFactory";
import { ContextualRequest } from "src/Core/Decorator/ContextualRequest";
import { ContextualGraphqlRequest } from "src";
import Notebook from "../Entity/Notebook";
import { UseGuards } from "@nestjs/common";
import GraphqlAuthGuard from "src/Core/Security/Guard/GraphqlAuthGuard";
import { DeleteNotebookUseCase } from "../UseCase/Notebook/DeleteNotebook/DeleteNotebookUseCase";
import { CreateNotebookUseCase } from "../UseCase/Notebook/CreateNotebook/CreateNotebookUseCase";
import { UpdateNotebookUseCase } from "../UseCase/Notebook/UpdateNotebook/UpdateNotebookUseCase";
import { GetNotebookUseCase } from "../UseCase/Notebook/GetNotebook/GetNotebookUseCase";
import { GetAllNotebooksUseCase } from "../UseCase/Notebook/GetAllNotebooks/GetAllNotebooksUseCase";
import SaveNotebookDto from "../Dto/SaveNotebookDto";

@Resolver(Notebook)
@UseGuards(GraphqlAuthGuard) // Only for connected users
export class NotebookResolver {
  constructor(private readonly serviceFactory: UseCaseFactory) {}

  /**
   * Create a notebook resolver
   * @param context
   * @param dto
   * @returns
   */
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

  /**
   * Delete a notebook resolver
   * @param context
   * @param id
   * @returns
   */
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

  /**
   * Update a notebook
   * @param context
   * @param notebookId
   * @param dto
   * @returns
   */
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

  @Query(() => Notebook)
  async getNotebook(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("notebookId", { type: () => Int }) notebookId: number
  ): Promise<Notebook> {
    return (await this.serviceFactory.create(GetNotebookUseCase)).handle(
      context,
      notebookId
    );
  }

  @Query(() => [Notebook])
  async getNotebooks(
    @ContextualRequest() context: ContextualGraphqlRequest
  ): Promise<Notebook[]> {
    return (await this.serviceFactory.create(GetAllNotebooksUseCase)).handle(
      context
    );
  }
}
