import { ContextualGraphqlRequest, UseCase } from "src";
import { BadRequestException, Injectable } from "@nestjs/common";
import NoteRepository from "src/Api/Repository/NoteRepository";
import SaveNoteDto from "src/Api/Dto/SaveNoteDto";
import { Note } from "@prisma/client";

@Injectable()
export default class CreateNoteUseCase
  implements UseCase<Promise<Note>, [dto: SaveNoteDto]>
{
  constructor(private readonly noteRepository: NoteRepository) {}
  async handle(
    context: ContextualGraphqlRequest,
    dto: SaveNoteDto
  ): Promise<Note> {
    try {
      return await this.noteRepository.save({
        ...dto,
        userId: context.userId,
      });
    } catch (error) {
      throw new BadRequestException("CreateNoteUseCaseFailed", error.message);
    }
  }
}
