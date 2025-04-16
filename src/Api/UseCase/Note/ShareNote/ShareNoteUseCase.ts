import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "src";
import SharedNoteRepository from "src/Api/Repository/ShareNoteRepository";
import NoteRepository from "src/Api/Repository/NoteRepository";
import UserRepository from "src/Api/Repository/UserRepository";
import { ShareNoteDto } from "src/Api/Dto/ShareNoteDto/ShareNoteDto";
import { SharedNote } from "@prisma/client";
import { use } from "passport";

@Injectable()
export default class ShareNoteUseCase 
implements UseCase<Promise<SharedNote>, [dto: ShareNoteDto]>{
  constructor(
    private readonly sharedNoteRepository: SharedNoteRepository,
    private readonly noteRepository: NoteRepository,
    private readonly userRepository: UserRepository
  ) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: ShareNoteDto
  ): Promise<SharedNote> {
    try {
      const { noteId, sharedWithUserId } = dto;
      const { userId } = context;

      if (userId === sharedWithUserId) {
        throw new BadRequestException("You cannot share a note with yourself");
      }

      const note = await this.noteRepository.findById(noteId);
      if (!note) {
        throw new NotFoundException("Note not found");
      }
      
      if (note.userId !== userId) {
        throw new UnauthorizedException("You don't have permission to share this note");
      }
      
      const sharedWith = await this.userRepository.findById(sharedWithUserId);
      if (!sharedWith) {
        throw new NotFoundException("User to share with not found");
      }
      
      const existingShare = await this.sharedNoteRepository.findBy({
        noteId,
        sharedWithUserId
      });
      
      if (existingShare) {
        throw new BadRequestException("This note is already shared with this user");
      }
      
      return this.sharedNoteRepository.create({
        note: { connect: { id: noteId } },
        sharedWith: { connect: { id: sharedWithUserId } },
        sharedByUser: { connect: { id: userId } },
      });
    } catch (error) {
      if (error instanceof NotFoundException || 
          error instanceof UnauthorizedException || 
          error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException("ShareNoteUseCaseFailed", error.message);
    }
  }
}