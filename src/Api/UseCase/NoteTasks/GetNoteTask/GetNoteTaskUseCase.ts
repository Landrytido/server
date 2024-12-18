import { BadRequestException, NotFoundException, Injectable } from "@nestjs/common";
import { NoteTask } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import NoteTaskRepository from "src/Api/Repository/NoteTasksRepository";

@Injectable()
export default class GetNoteTaskUseCase
  implements UseCase<Promise<NoteTask>, [number]>
{
  constructor(private readonly noteTaskRepository: NoteTaskRepository) {}

  async handle(context: ContextualGraphqlRequest, noteTaskId: number): Promise<NoteTask> {
    try {
      const noteTask = await this.noteTaskRepository.findById(noteTaskId);
      if (!noteTask) {
        throw new NotFoundException(`NoteTask with ID ${noteTaskId} not found.`);
      }
      return noteTask;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException("Cannot find note-task", error.message);
    }
  }
}
