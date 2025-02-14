import { UseGuards } from "@nestjs/common";

import {
  Args,
  Int,
  Mutation,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";

import GraphqlAuthGuard from "src/Core/Security/Guard/GraphqlAuthGuard";

import MeetingInvitation from "../Entity/MeetingInvitation";

import UncontextualUseCaseFactory from "../UseCase/UncontextualUseCaseFactory";

import GetMeetingInvitationBySenderIdUseCase from "../UseCase/MeetingInvitation/GetMeetingInvitationBySenderIdUseCase";
import GetMeetingInvitationByReceiverIdUseCase from "../UseCase/MeetingInvitation/GetMeetingInvitationByReceiverIdUseCase";
import GetMeetingInvitationByMeetingIdUseCase from "../UseCase/MeetingInvitation/GetMeetingInvitationByMeetingIdUseCase";
import SaveMeetingInvitationDto from "../Dto/SaveMeetingInvitationDto";
import CreateMeetingInvitaionUseCase from "../UseCase/MeetingInvitation/CreateMeetingInvitationUseCase";
import UpdateMeetingInvitationUseCase from "../UseCase/MeetingInvitation/UpdateMeetingInvitationUseCase";
import DeleteMeetingInvitationUseCase from "../UseCase/MeetingInvitation/DeleteMeetingInvitationUseCase";
import { Meeting } from "../Entity/Meeting";
import UseCaseFactory from "../UseCase/UseCaseFactory";
import GetMeetingUseCase from "../UseCase/Meeting/GetMeetingUseCase";
import AcceptMeetingInvitation from "../UseCase/MeetingInvitation/AcceptMeetingInvitationUseCase";
import DenyMeetingInvitation from "../UseCase/MeetingInvitation/DenyMeetingInvitationUseCase";
import GetMeetingInvitationByIdUseCase from "../UseCase/MeetingInvitation/GetMeetingInvitationByIdUseCase";

@Resolver(MeetingInvitation)
@UseGuards(GraphqlAuthGuard)
export default class MeetingInvitationResolver {
  constructor(
    private readonly useCaseFactory: UseCaseFactory,
    private readonly uncontextualUseCaseFactory: UncontextualUseCaseFactory,
  ) {}

  @UseGuards(GraphqlAuthGuard)
  @Query(() => MeetingInvitation)
  async getMeetingInvitationById(
    @Args("id", { type: () => Int }) id: number,
  ): Promise<MeetingInvitation> {
    return (
      await this.uncontextualUseCaseFactory.create(
        GetMeetingInvitationByIdUseCase,
      )
    ).handle(id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [MeetingInvitation])
  async getMeetingInvitationsBySenderId(
    @Args("id", { type: () => Int }) id: number,
  ): Promise<MeetingInvitation[]> {
    return (
      await this.uncontextualUseCaseFactory.create(
        GetMeetingInvitationBySenderIdUseCase,
      )
    ).handle(id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [MeetingInvitation])
  async getMeetingInvitationsByReceiverId(
    @Args("id", { type: () => Int }) id: number,
  ): Promise<MeetingInvitation[]> {
    return (
      await this.uncontextualUseCaseFactory.create(
        GetMeetingInvitationByReceiverIdUseCase,
      )
    ).handle(id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [MeetingInvitation])
  async getMeetingInvitationsByMeetingId(
    @Args("id", { type: () => Int }) id: number,
  ): Promise<MeetingInvitation[]> {
    return (
      await this.uncontextualUseCaseFactory.create(
        GetMeetingInvitationByMeetingIdUseCase,
      )
    ).handle(id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => [MeetingInvitation])
  async createMeetingInvitation(
    @Args("dto") dto: SaveMeetingInvitationDto,
  ): Promise<MeetingInvitation[]> {
    return (
      await this.uncontextualUseCaseFactory.create(
        CreateMeetingInvitaionUseCase,
      )
    ).handle(dto);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => MeetingInvitation)
  async updateMeetingInvitation(
    @Args("dto") dto: SaveMeetingInvitationDto,
  ): Promise<MeetingInvitation> {
    return (
      await this.uncontextualUseCaseFactory.create(
        UpdateMeetingInvitationUseCase,
      )
    ).handle(dto);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => MeetingInvitation)
  async acceptMeetingInvitation(
    @Args("id", { type: () => Int }) id: number,
  ): Promise<MeetingInvitation> {
    return (
      await this.uncontextualUseCaseFactory.create(AcceptMeetingInvitation)
    ).handle(id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => MeetingInvitation)
  async denyMeetingInvitation(
    @Args("id", { type: () => Int }) id: number,
  ): Promise<MeetingInvitation> {
    return (
      await this.uncontextualUseCaseFactory.create(DenyMeetingInvitation)
    ).handle(id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => MeetingInvitation)
  async deleteMeetingInvitation(
    @Args("id", { type: () => Int }) id: number,
  ): Promise<MeetingInvitation> {
    return (
      await this.uncontextualUseCaseFactory.create(
        DeleteMeetingInvitationUseCase,
      )
    ).handle(id);
  }

  @ResolveField(() => Meeting)
  async meeting(meetingInvitation: MeetingInvitation) {
    return (await this.useCaseFactory.create(GetMeetingUseCase)).handle(
      null,
      meetingInvitation.meetingId,
    );
  }
}
