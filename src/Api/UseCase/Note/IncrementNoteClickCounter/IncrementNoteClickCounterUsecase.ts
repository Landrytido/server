// src/UseCase/Note/IncrementNoteClickCounter/IncrementNoteClickCounterUseCase.ts
import { Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest } from "src";
import NoteRepository from "../../../Repository/NoteRepository";
import UserRepository from "../../../Repository/UserRepository";

@Injectable()
export default class IncrementNoteClickCounterUseCase {
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
    if (!note) {
      throw new Error(`Note with ID ${noteId} not found`);
    }

    const isOwner = note.userId === user.id;
    const isCollaborator = note.collaborations.some(
      (collab) => collab.userId === user.id
    );

    if (!isOwner && !isCollaborator) {
      throw new Error("You do not have permission to access this note");
    }

    return this.noteRepository.incrementClickCounter(noteId);
  }
}