import { ContextualGraphqlRequest, UseCase } from "src";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import NoteRepository from "src/Api/Repository/NoteRepository";
import SaveNoteDto from "src/Api/Dto/SaveNoteDto";
import InsufficientPermissionException from "src/Core/Exception/InsufficientPermissionException";
import { Note } from "@prisma/client";

@Injectable()
export default class UpdateNoteUseCase
  implements UseCase<Promise<Note>, [noteId: number, dto: SaveNoteDto]>
{
  constructor(private readonly noteRepository: NoteRepository) {}

  async handle(
    context: ContextualGraphqlRequest,
    noteId: number,
    dto: SaveNoteDto
  ) {
    try {
      const note = await this.noteRepository.findById(noteId);

      if (!note) throw new NotFoundException("Note not found");

      if (note.userId !== context.userId)
        throw new InsufficientPermissionException(
          "You don't have permission to perform this action"
        );

      return this.noteRepository.save({
        ...dto,
        id: noteId,
        userId: context.userId,
      });
    } catch (error) {
      throw new BadRequestException("UpdateNoteUseCaseFailed", error.message);
    }
  }
}
