// src/UseCase/Note/IncrementNoteClickCounter/IncrementNoteClickCounterUseCase.ts
import { Injectable } from "@nestjs/common";
import { Note } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import NoteRepository from "../../../Repository/NoteRepository";
import UserRepository from "../../../Repository/UserRepository";

@Injectable()
export default class IncrementNoteClickCounterUseCase
  implements UseCase<Promise<Note>, [number]> {
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly userRepository: UserRepository
  ) {}

  async handle(context: ContextualGraphqlRequest, noteId: number) {
    const user = await this.userRepository.findById(context.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const note = await this.noteRepository.findById(noteId);
    const hasAccess = note?.userId === user.id || 
                      note?.collaborations.some(c => c.userId === user.id);
    
    if (!note || !hasAccess) {
      throw new Error("Note introuvable ou non autorisée");
    }

    return this.noteRepository.incrementClickCounter(noteId);
  }
}