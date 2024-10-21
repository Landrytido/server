import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import UseCaseFactory from "../UseCase/UseCaseFactory";
import { ContextualGraphqlRequest } from "src";
import { ContextualRequest } from "src/Core/Decorator/ContextualRequest";
import { SaveNoteTaskDto } from "../Dto/SaveNoteTaskDto";
import { UseGuards } from "@nestjs/common";
import GraphqlAuthGuard from "src/Core/Security/Guard/GraphqlAuthGuard";
import GetNoteTaskByUserIdUseCase from "../UseCase/NoteTasks/GetNoteTaskbyUserId/GetNoteTaskByUserIdUseCase"; 
import GetNoteTaskUseCase from "../UseCase/NoteTasks/GetNoteTask/GetNoteTaskUseCase"; 
import RemoveNoteTaskUseCase from "../UseCase/NoteTasks/RemoveNoteTask/RemoveNoteTaskUseCase"; 
import NoteTask from "../Entity/NoteTask"; 
import GetAllNoteTaskUseCase from "../UseCase/NoteTasks/GetAllNoteTask/GetAllNoteTaskUseCase"; 
import SaveNoteTaskUseCase from "../UseCase/NoteTasks/SaveNoteTask/SaveNoteTaskUseCase"; 


@Resolver(NoteTask) 
@UseGuards(GraphqlAuthGuard)
export default class NoteTaskResolver { 
  constructor(private readonly serviceFactory: UseCaseFactory) {}

  @Mutation(() => NoteTask) 
  async saveNoteTask(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("dto") dto: SaveNoteTaskDto // Vérifiez si vous avez besoin d'un DTO différent
  ) {
    return (await this.serviceFactory.create(SaveNoteTaskUseCase)).handle(
      context,
      dto
    );
  }

  @Query(() => [NoteTask]) 
  async noteTasksByUserId(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("dto") dto:SaveNoteTaskDto 
  ) { 
    return (await this.serviceFactory.create(GetNoteTaskByUserIdUseCase)).handle(
      context,
      dto
    );
  }

  @Query(() => NoteTask) 
  async findNoteTaskById(
    @Args("id", { type: () => Int }) id: number,
    @ContextualRequest() context: ContextualGraphqlRequest
  ) {
    return (await this.serviceFactory.create(GetNoteTaskUseCase)).handle(
      context,
      id
    );
  }

  @Query(() => [NoteTask]) // Remplacer Task par NoteTask
  async getAllNoteTask(@ContextualRequest() context: ContextualGraphqlRequest) {
    return (await this.serviceFactory.create(GetAllNoteTaskUseCase)).handle(
      context
    );
  }

  @Mutation(() => NoteTask) // Remplacer Task par NoteTask
  async removeNoteTaskById(
    @Args("id", { type: () => Int }) id: number,
    @ContextualRequest() context: ContextualGraphqlRequest
  ) {
    return (await this.serviceFactory.create(RemoveNoteTaskUseCase)).handle(
      context,
      id
    );
  }
}
