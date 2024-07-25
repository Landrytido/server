import { ContextualGraphqlRequest, UseCase } from "src";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import Note from "src/Api/Entity/Note";
import NoteRepository from "src/Api/Repository/NoteRepository";

@Injectable()
export default class GetNoteUseCase
  implements UseCase<Promise<Note>, [noteId: number]>
{
  constructor(private readonly noteRepository: NoteRepository) {}
  async handle(
    context: ContextualGraphqlRequest,
    noteId: number
  ): Promise<Note> {
    try {
      const note = await this.noteRepository.findById(noteId);

      if (!note) throw new NotFoundException("Note not found");

      return note;
    } catch (error) {
      throw new BadRequestException("GetNoteUseCaseFailed", error.message);
    }
  }
}
