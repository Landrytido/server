import { Injectable } from "@nestjs/common";
import { Note } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import NoteRepository from "src/Api/Repository/NoteRepository";

@Injectable()
export default class GetNotesByLabelUseCase
  implements UseCase<Promise<Note[]>, [string[]]>
{
  constructor(private readonly noteRepository: NoteRepository) {}

  async handle(_context: ContextualGraphqlRequest, labelIds: string[]) {
    if (!labelIds || labelIds.length === 0) {
      throw new Error("Label IDs must be provided");
    }

    return this.noteRepository.findNotesByLabel(labelIds);
  }
}
