import { BadRequestException, Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "src";
import Note from "src/Api/Entity/Note";
import NoteRepository from "src/Api/Repository/NoteRepository";

@Injectable()
export default class GetNotesByUserIdUseCase
  implements UseCase<Promise<Note[]>, []>
{
  constructor(private readonly noteRepository: NoteRepository) {}
  async handle(context: ContextualGraphqlRequest): Promise<Note[]> {
    try {
      return await this.noteRepository.findByUserId(context.userId);
    } catch (error) {
      throw new BadRequestException(
        "GetNoteByUserIdUseCaseFailed",
        error.message
      );
    }
  }
}
