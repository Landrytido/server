import { BadRequestException, Injectable } from "@nestjs/common";
import { NoteTask } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import { SaveNoteTaskDto } from "src/Api/Dto/SaveNoteTaskDto";
import NoteTaskRepository from "src/Api/Repository/NoteTasksRepository";

@Injectable()
export default class GetNoteTaskByUserIdUseCase
  implements UseCase<Promise<NoteTask[]>, number>
{
  constructor(private readonly noteTaskRepository: NoteTaskRepository) {}

  async handle(context: ContextualGraphqlRequest, dto: SaveNoteTaskDto) {
    try {
      if (!dto.userId) {
        throw new BadRequestException("User ID is required.");
      }
      
      return await this.noteTaskRepository.findByUserId(dto.userId);
    } catch (error) {
      throw new BadRequestException(
        "GetNoteTaskByUserIdUseCaseFailed",
        error.message
      );
    }
  }
}
