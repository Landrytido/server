import { BadRequestException, Injectable } from "@nestjs/common";
import { Task } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import SaveTaskDto from "src/Api/Dto/SaveTaskDto";
import TaskRepository from "src/Api/Repository/TaskRepository";

// TODO: Remove this model after refactoring tasks, events, meetings into CalendarEvent ❌
@Injectable()
export class CreateTaskUseCase
  implements UseCase<Promise<Task>, [dto: SaveTaskDto]>
{
  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(context: ContextualGraphqlRequest, dto: SaveTaskDto) {
    try {
      return await this.taskRepository.save({
        ...dto,
        userId: context.userId,
      });
    } catch (error) {
      throw new BadRequestException(
        "Impossible de créer la tâche",
        error.message,
      );
    }
  }
}
