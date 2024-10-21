import { ForbiddenException, Injectable } from "@nestjs/common";
import { NoteTask } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import { SaveNoteTaskDto } from "src/Api/Dto/SaveNoteTaskDto";
import NoteTaskRepository from "src/Api/Repository/NoteTasksRepository";

@Injectable()
export default class SaveNoteTaskUseCase
  implements UseCase<Promise<NoteTask>, [dto: SaveNoteTaskDto]>
{
  constructor(private readonly noteTaskRepository: NoteTaskRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: SaveNoteTaskDto
  ): Promise<NoteTask> {
    try {
      if (dto.id && context.userId !== dto.userId) {
        throw new ForbiddenException("Not authorized");
      }
      return this.noteTaskRepository.save(dto);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
