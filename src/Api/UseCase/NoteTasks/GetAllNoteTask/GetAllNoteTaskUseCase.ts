import { Injectable, NotFoundException } from "@nestjs/common";
import { NoteTask } from "@prisma/client";
import { ContextualGraphqlRequest } from "src";
import NoteTaskRepository from "src/Api/Repository/NoteTasksRepository";
@Injectable()
export default class GetAllNoteTaskUseCase {
    constructor(private readonly noteTaskRepository: NoteTaskRepository) {}

    async handle(context: ContextualGraphqlRequest): Promise<NoteTask[]> {
        const noteTasks = await this.noteTaskRepository.findAllNoteTask();
        return noteTasks;
    }
}
