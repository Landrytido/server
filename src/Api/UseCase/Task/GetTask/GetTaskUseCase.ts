import { BadRequestException, Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "src";
import { Task } from "src/Api/Entity/Task";
import TaskRepository from "src/Api/Repository/TaskRepository";

@Injectable()
export default class GetTaskUseCase implements UseCase<Promise<Task>, [tagId: number]> {
    constructor(private readonly tagRepository: TaskRepository) {}

    handle(context: ContextualGraphqlRequest, tagId: number){
        try {
            return this.tagRepository.findById(tagId);
        } catch (error) {
            throw new BadRequestException("cannot find task",error.message);
        }
    }
}
