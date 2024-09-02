import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import UseCaseFactory from "../UseCase/UseCaseFactory";
import { ContextualGraphqlRequest } from "src";
import { ContextualRequest } from "src/Core/Decorator/ContextualRequest";
import SaveTaskDto from "../Dto/SaveTaskDto";
import { CreateTaskUseCase } from "../UseCase/Task/CreateTask/CreateTaskUseCase";
import { UseGuards } from "@nestjs/common";
import GraphqlAuthGuard from "src/Core/Security/Guard/GraphqlAuthGuard";
import GetTaskByUserIdUseCase from "../UseCase/Task/GetTaskbyUserId/GetTaskByUserIdUseCase";
import GetTaskUseCase from "../UseCase/Task/GetTask/GetTaskUseCase";
import RemoveTaskUseCase from "../UseCase/Task/RemoveTask/RemoveTaskUseCase";
import UpdateTaskUseCase from "../UseCase/Task/UpdateTask/UpdateTaskUseCase";
import Task from "../Entity/Task";

@Resolver(Task)
@UseGuards(GraphqlAuthGuard)
export default class TaskResolver {
  constructor(private readonly serviceFactory: UseCaseFactory) {}

  @Mutation(() => Task)
  async createTask(
    @Args("dto") dto: SaveTaskDto,
    @ContextualRequest() context: ContextualGraphqlRequest
  ) {
    return (await this.serviceFactory.create(CreateTaskUseCase)).handle(
      context,
      dto
    );
  }
  @Query(() => [Task])
  async tasksByUserId(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("userId",{type:()=>Int}) userId: number
  ): Promise<Task[]> {
    return (await this.serviceFactory.create(GetTaskByUserIdUseCase)).handle(
      context
    );
  }

  @Query(() => Task)
  async findTaskById(
    @Args("id",{type:()=>Int}) id: number,
    @ContextualRequest() context: ContextualGraphqlRequest
  ) {
    return (await this.serviceFactory.create(GetTaskUseCase)).handle(
      context,
      id
    );
  }

  @Mutation(() => Task)
  async RemoveById(
    @Args("id",{type:()=>Int}) id: number,
    @ContextualRequest() context: ContextualGraphqlRequest
  ) {
    return (await this.serviceFactory.create(RemoveTaskUseCase)).handle(
      context,
      id
    );
  }

  @Mutation(() => Task)
  async UpdateById(
    @Args("id", { type: () => Int }) id: number,
    @Args("dto") dto: SaveTaskDto,
    @ContextualRequest() context: ContextualGraphqlRequest
  ) {
    return (await this.serviceFactory.create(UpdateTaskUseCase)).handle(
      context,
      id,
      dto
    );
  }
}
