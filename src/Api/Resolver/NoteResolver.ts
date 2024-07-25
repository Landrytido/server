import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import UseCaseFactory from "../UseCase/UseCaseFactory";
import { ContextualRequest } from "src/Core/Decorator/ContextualRequest";
import { ContextualGraphqlRequest } from "src";
import Note from "../Entity/Note";
import { UseGuards } from "@nestjs/common";
import GraphqlAuthGuard from "src/Core/Security/Guard/GraphqlAuthGuard";
import DeleteNoteUseCase from "../UseCase/Note/DeleteNote/DeleteNoteUseCase";
import SaveNoteDto from "../Dto/SaveNoteDto";
import CreateNoteUseCase from "../UseCase/Note/CreateNote/CreateNoteUseCase";
import UpdateNoteUseCase from "../UseCase/Note/UpdateNote/UpdateNoteUseCase";
import GetAllNotesUseCase from "../UseCase/Note/GetAllNotes/GetAllNoteUseCase";
import GetNoteUseCase from "../UseCase/Note/GetNote/GetNoteUseCase";
import GetNotesByUserIdUseCase from "../UseCase/Note/GetNotesByUserId/GetNotesByUserIdUseCase";

@Resolver(Note)
@UseGuards(GraphqlAuthGuard)
export default class NoteResolver {
  constructor(private readonly serviceFactory: UseCaseFactory) {}

  @Mutation(() => Note)
  async createNote(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("dto") dto: SaveNoteDto
  ): Promise<Note> {
    return (await this.serviceFactory.create(CreateNoteUseCase)).handle(
      context,
      dto
    );
  }

  @Mutation(() => Note)
  async updateNote(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("noteId", { type: () => Int }) noteId: number,
    @Args("dto") dto: SaveNoteDto
  ): Promise<Note> {
    return (await this.serviceFactory.create(UpdateNoteUseCase)).handle(
      context,
      noteId,
      dto
    );
  }

  @Mutation(() => Note)
  async deleteNote(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("noteId", { type: () => Int }) noteId: number
  ): Promise<Note> {
    return (await this.serviceFactory.create(DeleteNoteUseCase)).handle(
      context,
      noteId
    );
  }

  @Query(() => Note)
  async findNoteById(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("noteId", { type: () => Int }) noteId: number
  ): Promise<Note> {
    return (await this.serviceFactory.create(GetNoteUseCase)).handle(
      context,
      noteId
    );
  }

  @Query(() => [Note])
  async findNotes(
    @ContextualRequest() context: ContextualGraphqlRequest
  ): Promise<Note[]> {
    return (await this.serviceFactory.create(GetAllNotesUseCase)).handle(
      context
    );
  }

  @Query(() => [Note])
  async findNotesByUserId(
    @ContextualRequest() context: ContextualGraphqlRequest
  ): Promise<Note[]> {
    return (await this.serviceFactory.create(GetNotesByUserIdUseCase)).handle(
      context
    );
  }
}
