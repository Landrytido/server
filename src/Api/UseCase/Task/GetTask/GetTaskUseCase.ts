import { BadRequestException, Injectable } from "@nestjs/common";
import { Task } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import TaskRepository from "src/Api/Repository/TaskRepository";

// TODO: Remove this model after refactoring tasks, events, meetings into CalendarEvent ❌
@Injectable()
export default class GetTaskUseCase
  implements UseCase<Promise<Task>, [tagId: number]>
{
  constructor(private readonly tagRepository: TaskRepository) {}

  handle(context: ContextualGraphqlRequest, tagId: number) {
    try {
      return this.tagRepository.findById(tagId);
    } catch (error) {
      throw new BadRequestException("cannot find task", error.message);
    }
  }
}
