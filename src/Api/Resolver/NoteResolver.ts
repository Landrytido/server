import { Args, Mutation, Resolver } from "@nestjs/graphql";
import Note from "../Entity/Note";
import { NotImplementedException, UseGuards } from "@nestjs/common";
import GraphqlAuthGuard from "src/Core/Security/Guard/GraphqlAuthGuard";
import UseCaseFactory from "../UseCase/UseCaseFactory";
import CreateNoteUseCase from "../UseCase/Note/CreateNote/CreateNoteUseCase";
import CreateOrUpdateNote from "../Dto/SaveNoteDto";
import { ContextualGraphqlRequest } from "src";
import { ContextualRequest } from "src/Core/Decorator/ContextualRequest";

@Resolver(Note)
@UseGuards(GraphqlAuthGuard)
export default class NoteResolver {
  constructor(private readonly serviceFactory: UseCaseFactory) {}

  @Mutation(() => Note)
  async createNote(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("dto") dto: CreateOrUpdateNote
  ): Promise<Note> {
    throw new NotImplementedException();
  }
}
