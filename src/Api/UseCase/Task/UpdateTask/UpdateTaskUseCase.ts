import { BadRequestException, Injectable } from "@nestjs/common";
import { Task } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import SaveTaskDto from "src/Api/Dto/SaveTaskDto";
import TaskRepository from "src/Api/Repository/TaskRepository";

// TODO: Remove this model after refactoring tasks, events, meetings into CalendarEvent ❌
@Injectable()
export default class UpdateTaskUseCase
  implements UseCase<Promise<Task>, [taskId: number, dto: SaveTaskDto]>
{
  constructor(private readonly taskRepository: TaskRepository) {}
  async handle(
    context: ContextualGraphqlRequest,
    taskId: number,
    dto: SaveTaskDto,
  ) {
    try {
      const data = { ...dto, userId: context.userId, id: taskId }; // Combiner dto et taskId
      return await this.taskRepository.save(data); // Envoyer un seul objet à `save`
    } catch (error) {
      throw new BadRequestException(
        "Impossible de mettre à jour la tâche",
        error.message,
      );
    }
  }
}
