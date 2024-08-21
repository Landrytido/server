import { BadRequestException, Injectable } from "@nestjs/common";
import { Task } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import TaskRepository from "src/Api/Repository/TaskRepository";

@Injectable()
export default class RemoveTaskUseCase
  implements UseCase<Promise<Task>, [taskId: number]>
{
  constructor(private readonly tagRepository: TaskRepository) {}

  handle(context: ContextualGraphqlRequest, taskId: number) {
    try {
      return this.tagRepository.RemoveById(taskId);
    } catch (error) {
      throw new BadRequestException(
        "no task has been created please create a new one ",
        error.message
      );
    }
  }
}
