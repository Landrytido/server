import { BadRequestException, Injectable } from "@nestjs/common";
import { NoteTask } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import NoteTaskRepository from "src/Api/Repository/NoteTasksRepository";

@Injectable()
export default class GetNoteTaskUseCase implements UseCase<Promise<NoteTask>, [noteTaskId: number]> {
    constructor(private readonly noteTaskRepository: NoteTaskRepository) {}

    handle(context: ContextualGraphqlRequest, noteTaskId: number) {
        try {
            return this.noteTaskRepository.findById(noteTaskId);
        } catch (error) {
            throw new BadRequestException("Cannot find note-task", error.message);
        }
    }
}
