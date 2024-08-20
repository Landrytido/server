import { ContextualGraphqlRequest, UseCase } from "src";
import { BadRequestException, Injectable } from "@nestjs/common";
import Note from "src/Api/Entity/Note";
import NoteRepository from "src/Api/Repository/NoteRepository";

@Injectable()
export default class GetAllNotesUseCase
  implements UseCase<Promise<Note[]>, []>
{
  constructor(private readonly noteRepository: NoteRepository) {}
  async handle(context: ContextualGraphqlRequest): Promise<Note[]> {
    try {
      return await this.noteRepository.findMany();
    } catch (error) {
      throw new BadRequestException("GetAllNotesUseCaseFailed", error.message);
    }
  }
}
