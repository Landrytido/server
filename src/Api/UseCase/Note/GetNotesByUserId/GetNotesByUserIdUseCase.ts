import { Injectable } from "@nestjs/common";
import { Note } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "src";
import NoteRepository from "src/Api/Repository/NoteRepository";
import UserRepository from "src/Api/Repository/UserRepository";

@Injectable()
export default class GetNotesByUserIdUseCase
  implements UseCase<Promise<Note[]>, []>
{
  constructor(private readonly noteRepository: NoteRepository, private readonly userRepository: UserRepository) {}
  async handle(
    context: ContextualGraphqlRequest,
    orderBy: string = "clickCounter",
    orderDirection: "asc" | "desc" = "desc"
  ) {
    const user = await this.userRepository.findById(context.userId);
    if (!user) {
      throw new Error("User not found");
    }

    return this.noteRepository.findByUserId(user.id, orderBy, orderDirection);
  }
}
