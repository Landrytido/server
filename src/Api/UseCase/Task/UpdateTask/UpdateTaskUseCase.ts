import { BadRequestException, Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "src";
import SaveTaskDto from "src/Api/Dto/SaveTaskDto";
import { Task } from "src/Api/Entity/Task";
import TaskRepository from "src/Api/Repository/TaskRepository";

@Injectable()
export default class UpdateTaskUseCase
  implements UseCase<Promise<Task>, [taskId: number,dto:SaveTaskDto]>
{
  constructor(private readonly taskRepository: TaskRepository) {}
  handle (context: ContextualGraphqlRequest, taskId: number, dto:SaveTaskDto ){
    try {
        return this.taskRepository.save({
          ...dto,
        userId:context.userId
        });
    } catch (error) {
        throw new BadRequestException("impossible de mettre a jour la tache");
        
    }
  }
}