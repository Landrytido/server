import { BadRequestException, Injectable } from "@nestjs/common";
import { NoteTask } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import NoteTaskRepository from "src/Api/Repository/NoteTasksRepository";

@Injectable()
export default class RemoveNoteTaskUseCase
  implements UseCase<Promise<NoteTask>, [noteTaskId: number]>
{
  constructor(private readonly noteTaskRepository: NoteTaskRepository) {}

  handle(context: ContextualGraphqlRequest, noteTaskId: number) {
    try {
      return this.noteTaskRepository.removeById(noteTaskId);
    } catch (error) {
      throw new BadRequestException(
        "No note-task has been created, please create a new one",
        error.message
      );
    }
  }
}
