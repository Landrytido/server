import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import GraphqlAuthGuard from "../../Core/Security/Guard/GraphqlAuthGuard";
import UseCaseFactory from "../UseCase/UseCaseFactory";
import Invitation from "../Entity/Invitation";
import { ContextualRequest } from "../../Core/Decorator/ContextualRequest";
import { ContextualGraphqlRequest } from "../../index";
import SaveInvitationDto from "../UseCase/Invitation/CreateInvitation/SaveInvitationDto";
import CreateInvitationUseCase from "../UseCase/Invitation/CreateInvitation/CreateInvitationUseCase";
import DeleteInvitationUseCase from "../UseCase/Invitation/DeleteInvitation/DeleteInvitationUseCase";
import AcceptInvitationUseCase from "../UseCase/Invitation/AcceptInvitation/AcceptInvitationUseCase";
import GetSentInvitationsUseCase from "../UseCase/Invitation/GetSentInvitations/GetSentInvitationsUseCase";
import GetReceivedInvitationsUseCase from "../UseCase/Invitation/GetReceivedInvitations/GetReceivedInvitationsUseCase";
import GetRelationUseCase from "../UseCase/Invitation/GetRelations/GetRelationUseCase";

@Resolver(Invitation)
@UseGuards(GraphqlAuthGuard)
export default class InvitationResolver {
  constructor(private readonly serviceFactory: UseCaseFactory) {}

  @Mutation(() => Invitation)
  async createInvitation(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("dto") dto: SaveInvitationDto
  ) {
    return await (
      await this.serviceFactory.create(CreateInvitationUseCase)
    ).handle(context, dto);
  }

  @Mutation(() => Invitation)
  async deleteInvitation(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("invitationId", { type: () => Int }) invitationId: number
  ) {
    return (await this.serviceFactory.create(DeleteInvitationUseCase)).handle(
      context,
      invitationId
    );
  }

  @Mutation(() => Invitation)
  async acceptInvitation(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("invitationId", { type: () => Int }) invitationId: number
  ) {
    return (await this.serviceFactory.create(AcceptInvitationUseCase)).handle(
      context,
      invitationId
    );
  }

  @Query(() => [Invitation])
  async findSentInvitations(
    @ContextualRequest() context: ContextualGraphqlRequest
  ) {
    return (await this.serviceFactory.create(GetSentInvitationsUseCase)).handle(
      context
    );
  }

  @Query(() => [Invitation])
  async findReceivedInvitations(
    @ContextualRequest() context: ContextualGraphqlRequest
  ) {
    return (
      await this.serviceFactory.create(GetReceivedInvitationsUseCase)
    ).handle(context);
  }

  @Query(() => [Invitation])
  async findRelations(@ContextualRequest() context: ContextualGraphqlRequest) {
    return (await this.serviceFactory.create(GetRelationUseCase)).handle(
      context
    );
  }
}
