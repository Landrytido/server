import { Task } from "src/Api/Entity/Task";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "src";
import TaskRepository from "src/Api/Repository/TaskRepository";

@Injectable()
export default class GetTaskByUserIdUseCase implements UseCase<Promise<Task[]>, []> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(context: ContextualGraphqlRequest): Promise<Task[]> {
    try {
      return await this.taskRepository.findByUserId(context.userId);
    } catch (error) {
      throw new BadRequestException(
        "GetTaskByUserIdUseCaseFailed",
        error.message
      );
    }
  }
}