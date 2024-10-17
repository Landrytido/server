import { Injectable, NotFoundException } from "@nestjs/common";
import { Task } from "@prisma/client";
import { ContextualGraphqlRequest } from "src";
import TaskRepository from "src/Api/Repository/TaskRepository";


@Injectable()
export default class GetAllTaskUseCase {
    constructor(private readonly taskRepository: TaskRepository) {}

    async handle(context: ContextualGraphqlRequest): Promise<Task[]> {
        const tasks = await this.taskRepository.findAllTask();
        return tasks;
    }
}
