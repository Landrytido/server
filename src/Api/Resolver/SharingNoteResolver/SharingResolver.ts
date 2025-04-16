// src/Api/Resolver/SharingNoteResolver/SharingResolver.ts
import { Args, Query, Resolver } from "@nestjs/graphql";
import { ContextualRequest } from "src/Core/Decorator/ContextualRequest";
import { ContextualGraphqlRequest } from "src";
import User from "../../Entity/User";
import { UseGuards } from "@nestjs/common";
import GraphqlAuthGuard from "src/Core/Security/Guard/GraphqlAuthGuard";
import { SharingService } from "../../Services/SharingService";
import SharedNote from "src/Api/Entity/SharedNote";

@Resolver()
@UseGuards(GraphqlAuthGuard)
export default class SharingResolver {
  constructor(private readonly sharingService: SharingService) {}

  @Query(() => [User])
  async searchUsersByEmail(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("query", { type: () => String }) query: string
  ) {
    return this.sharingService.searchUsersByEmail(context, query);
  }

  @Query(() => [SharedNote])
  async getNotesSharedWithMe(
    @ContextualRequest() context: ContextualGraphqlRequest
  ) {
    return this.sharingService.getNotesSharedWithMe(context.userId);
  }
}