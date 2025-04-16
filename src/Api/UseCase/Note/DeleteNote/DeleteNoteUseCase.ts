import { ContextualGraphqlRequest, UseCase } from "src";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import NoteRepository from "src/Api/Repository/NoteRepository";
import InsufficientPermissionException from "src/Core/Exception/InsufficientPermissionException";
import { Note } from "@prisma/client";
import ShareNoteRepository from "src/Api/Repository/ShareNoteRepository";

@Injectable()
export default class DeleteNoteUseCase
  implements UseCase<Promise<Note>, [noteId: number]>
{
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly shareNoteRepository: ShareNoteRepository
  ) {}
  async handle(
    context: ContextualGraphqlRequest,
    noteId: number
  ): Promise<Note> {
    try {
      const note = await this.noteRepository.findById(noteId);

      if (!note) throw new NotFoundException("Note not found");

      const isOwner = note.userId === context.userId;

      if (!isOwner) {
        const sharedNote = await this.shareNoteRepository.findBy({
          noteId,
          sharedWithUserId: context.userId,
        });

        if (!sharedNote) {
          throw new InsufficientPermissionException(
            "You do not have permission to delete this note."
          );
        }

        await this.shareNoteRepository.delete(sharedNote.id);
        return note;
      }

      await this.shareNoteRepository.deleteAllForNote(noteId);

      return await this.noteRepository.remove(noteId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof InsufficientPermissionException) {
        throw error;
      }  
      throw new BadRequestException("DeleteNoteUseCaseFailed", error.message);
    }
  }
}
