import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import UseCaseFactory from "../UseCase/UseCaseFactory";
import { ContextualGraphqlRequest } from "src";
import { ContextualRequest } from "src/Core/Decorator/ContextualRequest";
import { UseGuards } from "@nestjs/common";
import GraphqlAuthGuard from "src/Core/Security/Guard/GraphqlAuthGuard";
import NoteTask from "../Entity/NoteTask";
import { SaveNoteTaskDto } from "../Dto/SaveNoteTaskDto";
import SaveNoteTaskUseCase from "../UseCase/NoteTasks/SaveNoteTask/SaveNoteTaskUseCase";
import { UpdateNoteTaskDto } from "../UseCase/NoteTasks/UpdateNoteTask/UpdateNoteTaskDto";
import UpdateNoteTaskUseCase from "../UseCase/NoteTasks/UpdateNoteTask/UpdateNoteTaskUseCase";
import { GetNoteTasksByUserIdDto } from "../UseCase/NoteTasks/GetNoteTaskbyUserId/GetNoteTasksByUserIdDto";
import GetNoteTaskByUserIdUseCase from "../UseCase/NoteTasks/GetNoteTaskbyUserId/GetNoteTaskByUserIdUseCase";
import GetNoteTaskUseCase from "../UseCase/NoteTasks/GetNoteTask/GetNoteTaskUseCase";
import RemoveNoteTaskUseCase from "../UseCase/NoteTasks/RemoveNoteTask/RemoveNoteTaskUseCase";

@Resolver(NoteTask)
@UseGuards(GraphqlAuthGuard)
export default class NoteTaskResolver {
  constructor(private readonly serviceFactory: UseCaseFactory) {}

  @Mutation(() => NoteTask)
  async saveNoteTask(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("dto") dto: SaveNoteTaskDto,
  ) {
    return (await this.serviceFactory.create(SaveNoteTaskUseCase)).handle(
      context,
      dto,
    );
  }

  @Mutation(() => NoteTask)
  async updateNoteTask(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("dto") dto: UpdateNoteTaskDto,
  ) {
    return (await this.serviceFactory.create(UpdateNoteTaskUseCase)).handle(
      context,
      dto,
    );
  }

  @Query(() => [NoteTask])
  async noteTasksByUserId(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("dto") dto: GetNoteTasksByUserIdDto,
  ) {
    return (
      await this.serviceFactory.create(GetNoteTaskByUserIdUseCase)
    ).handle(context, dto);
  }

  @Query(() => NoteTask)
  async findNoteTaskById(
    @Args("id", { type: () => Int }) id: number,
    @ContextualRequest() context: ContextualGraphqlRequest,
  ) {
    return (await this.serviceFactory.create(GetNoteTaskUseCase)).handle(
      context,
      id,
    );
  }

  @Mutation(() => NoteTask)
  async removeNoteTaskById(
    @Args("id", { type: () => Int }) id: number,
    @ContextualRequest() context: ContextualGraphqlRequest,
  ) {
    return (await this.serviceFactory.create(RemoveNoteTaskUseCase)).handle(
      context,
      id,
    );
  }
}
