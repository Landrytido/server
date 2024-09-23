import { ForbiddenException, Injectable } from "@nestjs/common";
import { Task } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import SaveTaskDto from "src/Api/Dto/SaveTaskDto";
import TaskRepository from "src/Api/Repository/TaskRepository";


@Injectable()
export default class SaveTaskUseCase
  implements UseCase<Promise<Task>, [dto: SaveTaskDto]>
{
  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: SaveTaskDto
  ): Promise<Task> {
    try {
      if (dto.id && context.userId !== dto.userId) {
        throw new ForbiddenException("Not authorized");
      }
      return this.taskRepository.save(dto);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}