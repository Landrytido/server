import { ContextualGraphqlRequest, UseCase } from "src";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import Note from "src/Api/Entity/Note";
import NoteRepository from "src/Api/Repository/NoteRepository";
import InsufficientPermissionException from "src/Core/Exception/InsufficientPermissionException";

@Injectable()
export default class DeleteNoteUseCase
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

      if (note.userId !== context.userId)
        throw new InsufficientPermissionException(
          "You don't have permission to delete this note"
        );

      return await this.noteRepository.remove(noteId, context.userId);
    } catch (error) {
      throw new BadRequestException("DeleteNoteUseCaseFailed", error.message);
    }
  }
}
