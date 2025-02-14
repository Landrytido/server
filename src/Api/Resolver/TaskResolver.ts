import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import UseCaseFactory from "../UseCase/UseCaseFactory";
import { ContextualGraphqlRequest } from "src";
import { ContextualRequest } from "src/Core/Decorator/ContextualRequest";
import SaveTaskDto from "../Dto/SaveTaskDto";
import { UseGuards } from "@nestjs/common";
import GraphqlAuthGuard from "src/Core/Security/Guard/GraphqlAuthGuard";
import GetTaskByUserIdUseCase from "../UseCase/Task/GetTaskbyUserId/GetTaskByUserIdUseCase";
import GetTaskUseCase from "../UseCase/Task/GetTask/GetTaskUseCase";
import RemoveTaskUseCase from "../UseCase/Task/RemoveTask/RemoveTaskUseCase";
import Task from "../Entity/Task";
import GetAllTaskUseCase from "../UseCase/Task/GetAllTask/GetAllTaskUseCase";
import SaveTaskUseCase from "../UseCase/Task/SaveTask/SaveTaskUseCase";

@Resolver(Task)
@UseGuards(GraphqlAuthGuard)
export default class TaskResolver {
  constructor(private readonly serviceFactory: UseCaseFactory) {}

  @Mutation(() => Task)
  async saveTask(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("dto") dto: SaveTaskDto
  ) {
    return (await this.serviceFactory.create(SaveTaskUseCase)).handle(
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

  @Query(() => [Task])
  async getAllTask(@ContextualRequest() context: ContextualGraphqlRequest) {
    return (await this.serviceFactory.create(GetAllTaskUseCase)).handle(
      context
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

  
}
