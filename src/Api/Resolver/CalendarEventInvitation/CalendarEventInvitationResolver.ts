import { UseGuards } from "@nestjs/common";

import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";

import GraphqlAuthGuard from "src/Core/Security/Guard/GraphqlAuthGuard";

import UncontextualUseCaseFactory from "src/Api/UseCase/UncontextualUseCaseFactory";

import GetCalendarEventInvitationByIdUseCase from "src/Api/UseCase/CalendarEventInvitation/GetCalendarEventInvitationById/GetCalendarEventInvitationUseCase";
import GetCalendarEventInvitationsBySenderIdUseCase from "src/Api/UseCase/CalendarEventInvitation/GetCalendarEventInvitationsBySenderId/GetCalendarEventInvitationsBySenderIdUseCase";
import GetCalendarEventInvitationsByReceiverEmailUseCase from "src/Api/UseCase/CalendarEventInvitation/GetCalendarEventInvitationsByReceiverEmail/GetCalendarEventInvitationsByReceiverEmailUseCase";
import GetCalendarEventInvitationsByCalendarEventIdUseCase from "src/Api/UseCase/CalendarEventInvitation/GetCalendarEventInvitationsByCalendarEventId/GetCalendarEventInvitationsByCalendarEventIdUseCase";

import CreateCalendarEventInvitationUseCase from "src/Api/UseCase/CalendarEventInvitation/CreateCalendarEventInvitation/CreateCalendarEventInvitationUseCase";
import DeleteCalendarEventInvitationUseCase from "src/Api/UseCase/CalendarEventInvitation/DeleteCalendarEventInvitation/DeleteCalendarEventInvitationUseCase";
import AcceptCalendarEventInvitationUseCase from "src/Api/UseCase/CalendarEventInvitation/AcceptCalendarEventInvitation/AcceptCalendarEventInvitationUseCase";
import DenyCalendarEventInvitationUseCase from "src/Api/UseCase/CalendarEventInvitation/DenyCalendarEventInvitation/DenyCalendarEventInvitationUseCase";

import CalendarEventInvitation from "src/Api/Entity/CalendarEventInvitation/CalendarEventInvitation";

import CreateCalendarEventInvitationDto from "src/Api/Dto/CalendarEventInvitationDto/CreateCalendarEventInvitationDto";

@Resolver(CalendarEventInvitation)
@UseGuards(GraphqlAuthGuard)
export default class CalendarEventInvitationResolver {
  constructor(
    private readonly uncontextualUseCaseFactory: UncontextualUseCaseFactory,
  ) {}

  @UseGuards(GraphqlAuthGuard)
  @Query(() => CalendarEventInvitation)
  async getCalendarEventInvitationById(
    @Args("id", { type: () => Int }) id: number,
  ): Promise<CalendarEventInvitation> {
    return (
      await this.uncontextualUseCaseFactory.create(
        GetCalendarEventInvitationByIdUseCase,
      )
    ).handle(id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [CalendarEventInvitation])
  async getCalendarEventInvitationsBySenderId(
    @Args("id", { type: () => Int }) id: number,
  ): Promise<CalendarEventInvitation[]> {
    return (
      await this.uncontextualUseCaseFactory.create(
        GetCalendarEventInvitationsBySenderIdUseCase,
      )
    ).handle(id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [CalendarEventInvitation])
  async getCalendarEventInvitationsByReceiverEmail(
    @Args("email") email: string,
  ): Promise<CalendarEventInvitation[]> {
    return (
      await this.uncontextualUseCaseFactory.create(
        GetCalendarEventInvitationsByReceiverEmailUseCase,
      )
    ).handle(email);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [CalendarEventInvitation])
  async getCalendarEventInvitationsByCalendarEventId(
    @Args("id", { type: () => Int }) id: number,
  ): Promise<CalendarEventInvitation[]> {
    return (
      await this.uncontextualUseCaseFactory.create(
        GetCalendarEventInvitationsByCalendarEventIdUseCase,
      )
    ).handle(id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => [CalendarEventInvitation])
  async createCalendarEventInvitation(
    @Args("invitedEmails", { type: () => [String] }) invitedEmails: string[],
    @Args("dto") dto: CreateCalendarEventInvitationDto,
  ): Promise<CalendarEventInvitation[]> {
    return (
      await this.uncontextualUseCaseFactory.create(
        CreateCalendarEventInvitationUseCase,
      )
    ).handle(invitedEmails, dto);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => CalendarEventInvitation)
  async acceptCalendarEventInvitation(
    @Args("id", { type: () => Int }) id: number,
  ): Promise<CalendarEventInvitation> {
    return (
      await this.uncontextualUseCaseFactory.create(
        AcceptCalendarEventInvitationUseCase,
      )
    ).handle(id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => CalendarEventInvitation)
  async denyCalendarEventInvitation(
    @Args("id", { type: () => Int }) id: number,
  ): Promise<CalendarEventInvitation> {
    return (
      await this.uncontextualUseCaseFactory.create(
        DenyCalendarEventInvitationUseCase,
      )
    ).handle(id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => CalendarEventInvitation)
  async deleteCalendarEventInvitation(
    @Args("id", { type: () => Int }) id: number,
  ): Promise<CalendarEventInvitation> {
    return (
      await this.uncontextualUseCaseFactory.create(
        DeleteCalendarEventInvitationUseCase,
      )
    ).handle(id);
  }
}
