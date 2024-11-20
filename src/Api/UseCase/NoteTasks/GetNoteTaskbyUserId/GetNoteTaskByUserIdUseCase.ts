import { BadRequestException, Injectable } from "@nestjs/common";
import { NoteTask } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import NoteTaskRepository from "src/Api/Repository/NoteTasksRepository";
import { GetNoteTasksByUserIdDto } from "./GetNoteTasksByUserIdDto";

@Injectable()
export default class GetNoteTaskByUserIdUseCase
  implements UseCase<Promise<NoteTask[]>, [GetNoteTasksByUserIdDto]>
{
  constructor(private readonly noteTaskRepository: NoteTaskRepository) {}

  async handle(context: ContextualGraphqlRequest, dto: GetNoteTasksByUserIdDto) {
    try {
      if (!dto.userId) {
        throw new BadRequestException("User ID is required.");
      }
      if (!dto.noteId) {
        throw new BadRequestException("Note ID is required.");
      }

      return await this.noteTaskRepository.findByUserIdAndNoteId(dto.userId, dto.noteId);
    } catch (error) {
      throw new BadRequestException(
        "GetNoteTaskByUserIdUseCaseFailed",
        error.message
      );
    }
  }
}
