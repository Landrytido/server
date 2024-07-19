import { BadRequestException, Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "src";
import SaveNoteDto from "src/Api/Dto/SaveNoteDto";

import Note from "src/Api/Entity/Note";
import NoteRepository from "src/Api/Repository/NoteRepository";

@Injectable()
export default class CreateNoteUseCase
  implements UseCase<Promise<Note>, [dto: SaveNoteDto]>
{
  constructor(private readonly notebookRepository: NoteRepository) {}
  handle(context: ContextualGraphqlRequest, dto: SaveNoteDto): Promise<Note> {
    try {
      return this.notebookRepository.create(context.userId, dto);
    } catch (error) {
      throw new BadRequestException("Failed to create note", error.message);
    }
  }
}
