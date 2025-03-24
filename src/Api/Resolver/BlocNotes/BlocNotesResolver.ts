// src/Api/Resolver/BlocNotes/BlocNotesResolver.ts
import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import UseCaseFactory from '../../UseCase/UseCaseFactory';
import { UseGuards } from "@nestjs/common";
import GraphqlAuthGuard from "src/Core/Security/Guard/GraphqlAuthGuard";
import BlocNote from "../../Entity/BlocNote";
import GetBlocNoteByUserIdUseCase from "../../UseCase/BlocNotes/GetBlocNotesByUserId/GetBlocNoteByUserIdUseCase";
import { ContextualRequest } from "src/Core/Decorator/ContextualRequest";
import {ContextualGraphqlRequest} from "../../../index";
import UpsertBlocNoteUseCase from "../../UseCase/BlocNotes/UpsertBlocNote/UpsertBlocNoteUseCase";

@Resolver(BlocNote)
@UseGuards(GraphqlAuthGuard)
export default class BlocNotesResolver {
    constructor(private readonly useCaseFactory: UseCaseFactory) {}

    @UseGuards(GraphqlAuthGuard)
    @Query(() => BlocNote)
    async findBlocNotesByUserId(
        @ContextualRequest() context: ContextualGraphqlRequest,
    ): Promise<BlocNote> {
        return (await this.useCaseFactory.create(GetBlocNoteByUserIdUseCase)).handle(context);
    }
    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => BlocNote)
    async upsertBlocNotes(
        @ContextualRequest() context: ContextualGraphqlRequest,
        @Args("content") content: string
    ): Promise<BlocNote> {
        return (await this.useCaseFactory.create(UpsertBlocNoteUseCase)).handle(context, content);
    }
}
