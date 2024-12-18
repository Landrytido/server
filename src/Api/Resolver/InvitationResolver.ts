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
import { Relation } from "../Entity/Relation";
import ConvertExternalInvitationUseCase from "../UseCase/Invitation/ConvertExternalInvitation/ConvertExternalInvitationUseCase";
import SaveUserDto from "../UseCase/User/SaveUser/SaveUserDto";
import UncontextualUseCaseFactory from "../UseCase/UncontextualUseCaseFactory";
import GetExternalEmailByTokenUseCase from "../UseCase/Invitation/GetExternalEmailByToken/GetExternalEmailByTokenUseCase";

@Resolver(Invitation)
export default class InvitationResolver {
  constructor(
    private readonly serviceFactory: UseCaseFactory,
    private readonly uncontextualUseCaseFactory: UncontextualUseCaseFactory
  ) {}

  @Mutation(() => Invitation)
  @UseGuards(GraphqlAuthGuard)
  async createInvitation(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("dto") dto: SaveInvitationDto
  ) {
    const result = await (
      await this.serviceFactory.create(CreateInvitationUseCase)
    ).handle(context, dto);
    return result;
  }

  @Mutation(() => Invitation)
  @UseGuards(GraphqlAuthGuard)
  async deleteInvitation(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("invitationId", { type: () => Int }) invitationId: number
  ) {
    const result = await (
      await this.serviceFactory.create(DeleteInvitationUseCase)
    ).handle(context, invitationId);
    return result;
  }

  @Mutation(() => Invitation)
  @UseGuards(GraphqlAuthGuard)
  async acceptInvitation(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("invitationId", { type: () => Int }) invitationId: number
  ) {
    return (await this.serviceFactory.create(AcceptInvitationUseCase)).handle(
      context,
      invitationId
    );
  }

  @Mutation(() => Invitation)
  @UseGuards(GraphqlAuthGuard)
  async convertExternalInvitation(@Args("dto") dto: SaveUserDto) {
    const resultConvertExternalInvitation = await (
      await this.uncontextualUseCaseFactory.create(
        ConvertExternalInvitationUseCase
      )
    ).handle(dto);
    return resultConvertExternalInvitation;
  }

  @Query(() => [Invitation])
  @UseGuards(GraphqlAuthGuard)
  async findSentInvitations(
    @ContextualRequest() context: ContextualGraphqlRequest
  ) {
    return (await this.serviceFactory.create(GetSentInvitationsUseCase)).handle(
      context
    );
  }

  @Query(() => [Invitation])
  @UseGuards(GraphqlAuthGuard)
  async findReceivedInvitations(
    @ContextualRequest() context: ContextualGraphqlRequest
  ) {
    const result = (
      await this.serviceFactory.create(GetReceivedInvitationsUseCase)
    ).handle(context);
    return result;
  }

  @Query(() => [Relation])
  @UseGuards(GraphqlAuthGuard)
  async findRelations(@ContextualRequest() context: ContextualGraphqlRequest) {
    const result = (
      await this.serviceFactory.create(GetRelationUseCase)
    ).handle(context);
    return result;
  }

  @Query(() => String)
  async findExternalEmailByToken(@Args("token") token: string) {
    const result = await (
      await this.uncontextualUseCaseFactory.create(
        GetExternalEmailByTokenUseCase
      )
    ).handle(token);
    return result;
  }
}
