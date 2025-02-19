import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import CalendarEvent from "../../Entity/CalendarEvent/CalendarEvent";
import GraphqlAuthGuard from "../../../Core/Security/Guard/GraphqlAuthGuard";
import UseCaseFactory from "../../UseCase/UseCaseFactory";
import { ContextualRequest } from "../../../Core/Decorator/ContextualRequest";
import { ContextualGraphqlRequest as CtxRequest } from "../../../index";

import { CreateCalendarEventDto } from "../../Dto/CalendarEventDto/CreateCalendarEventDto";
import { UpdateCalendarEventDto } from "../../Dto/CalendarEventDto/UpdateCalendarEventDto";

import CreateCalendarEventUseCase from "../../UseCase/CalendarEvent/CreateCalendarEvent/CreateCalendarEventUseCase";
import UpdateCalendarEventUseCase from "../../UseCase/CalendarEvent/UpdateCalendarEvent/UpdateCalendarEventUseCase";
import DeleteCalendarEventUseCase from "../../UseCase/CalendarEvent/DeleteCalendarEvent/DeleteCalendarEventUseCase";
import GetAllCalendarEventsUseCase from "../../UseCase/CalendarEvent/GetAllCalendarEvents/GetAllCalendarEventsUseCase";
import GetOneCalendarEventUseCase from "../../UseCase/CalendarEvent/GetCalendarEvent/GetCalendarEventUseCase";
import GetCalendarEventsByUserIdUseCase from "../../UseCase/CalendarEvent/GetCalendarEventsByUserId/GetCalendarEventsByUserIdUseCase";
import MarkNotificationAsSentUseCase from "../../UseCase/CalendarEvent/MarkNotificationAsSent/MarkNotificationAsSentUseCase";
import GetCalendarEventByTokenUseCase from "src/Api/UseCase/CalendarEvent/GetCalendarEventByToken/GetCalendarEventByTokenUseCase";

@Resolver(() => CalendarEvent)
export default class CalendarEventResolver {
  constructor(private readonly useCaseFactory: UseCaseFactory) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => CalendarEvent)
  async createCalendarEvent(
    @ContextualRequest() context: CtxRequest,
    @Args("dto") dto: CreateCalendarEventDto,
  ): Promise<CalendarEvent> {
    return (await (
      await this.useCaseFactory.create(CreateCalendarEventUseCase)
    ).handle(context, dto)) as CalendarEvent;
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => CalendarEvent)
  async updateCalendarEvent(
    @ContextualRequest() context: CtxRequest,
    @Args("id", { type: () => Int }) id: number,
    @Args("dto") dto: UpdateCalendarEventDto,
  ): Promise<CalendarEvent> {
    return (await (
      await this.useCaseFactory.create(UpdateCalendarEventUseCase)
    ).handle(context, id, dto)) as CalendarEvent;
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => CalendarEvent)
  async deleteCalendarEvent(
    @ContextualRequest() context: CtxRequest,
    @Args("id", { type: () => Int }) id: number,
  ): Promise<CalendarEvent> {
    return (await (
      await this.useCaseFactory.create(DeleteCalendarEventUseCase)
    ).handle(context, id)) as CalendarEvent;
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [CalendarEvent])
  async getAllCalendarEvents(
    @ContextualRequest() context: CtxRequest,
  ): Promise<CalendarEvent[]> {
    return (await (
      await this.useCaseFactory.create(GetAllCalendarEventsUseCase)
    ).handle(context)) as CalendarEvent[];
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => CalendarEvent)
  async getCalendarEvent(
    @ContextualRequest() context: CtxRequest,
    @Args("id", { type: () => Int }) id: number,
  ): Promise<CalendarEvent> {
    return (await (
      await this.useCaseFactory.create(GetOneCalendarEventUseCase)
    ).handle(context, id)) as CalendarEvent;
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [CalendarEvent])
  async getCalendarEventsByUserId(
    @ContextualRequest() context: CtxRequest,
    @Args("userId", { type: () => Int }) userId: number,
  ): Promise<CalendarEvent[]> {
    return (await (
      await this.useCaseFactory.create(GetCalendarEventsByUserIdUseCase)
    ).handle(context, userId)) as CalendarEvent[];
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [CalendarEvent])
  async getCalendarEventsByToken(
    @ContextualRequest() context: CtxRequest,
    @Args("token") token: string,
  ): Promise<CalendarEvent> {
    return (await (
      await this.useCaseFactory.create(GetCalendarEventByTokenUseCase)
    ).handle(context, token)) as CalendarEvent;
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => CalendarEvent)
  async markNotificationAsSent(
    @ContextualRequest() context: CtxRequest,
    @Args("id", { type: () => Int }) id: number,
  ): Promise<CalendarEvent> {
    return (await (
      await this.useCaseFactory.create(MarkNotificationAsSentUseCase)
    ).handle(context, id)) as CalendarEvent;
  }
}
