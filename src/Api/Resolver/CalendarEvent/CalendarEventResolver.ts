import { UseGuards } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ContextualGraphqlRequest } from "src";
import CreateCalendarEventDto from "src/Api/Dto/CalendarEvent/CreateCalendarEventDto";
import CalendarEvent from "src/Api/Entity/CalendarEvent/CalendarEvent";
import CreateCalendarEventUseCase from "src/Api/UseCase/CalendarEvent/CreateCalendarEvent/CreateCalendarEventUseCase";
import GetCalendarEventByIdUseCase from "src/Api/UseCase/CalendarEvent/GetCalendarEventById/GetCalendarEventByIdUseCase";
import GetCalendarEventByTokenUseCase from "src/Api/UseCase/CalendarEvent/GetCalendarEventByToken/GetCalendarEventByTokenUseCase";
import GetCalendarEventsByUserIdUseCase from "src/Api/UseCase/CalendarEvent/GetCalendarEventsByUserId/GetCalendarEventsByUserIdUseCase";
import UpdateCalendarEventUseCase from "src/Api/UseCase/CalendarEvent/UpdateCalendarEvent/UpdateCalendarEventUseCase";
import UncontextualUseCaseFactory from "src/Api/UseCase/UncontextualUseCaseFactory";
import UseCaseFactory from "src/Api/UseCase/UseCaseFactory";
import { ContextualRequest } from "src/Core/Decorator/ContextualRequest";
import GraphqlAuthGuard from "src/Core/Security/Guard/GraphqlAuthGuard";

@Resolver(() => CalendarEvent)
@UseGuards(GraphqlAuthGuard)
export default class CalendarEventResolver {
  constructor(
    private readonly useCaseFactory: UseCaseFactory,
    private readonly uncontextualUseCaseFactory: UncontextualUseCaseFactory,
  ) {}

  @UseGuards(GraphqlAuthGuard)
  @Query(() => CalendarEvent)
  async getCalendarEventById(
    @Args("id", { type: () => Int }) id: number,
  ): Promise<CalendarEvent> {
    return (
      await this.uncontextualUseCaseFactory.create(GetCalendarEventByIdUseCase)
    ).handle(id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => CalendarEvent)
  async getCalendarEventByToken(
    @Args("token") token: string,
  ): Promise<CalendarEvent> {
    return (
      await this.uncontextualUseCaseFactory.create(
        GetCalendarEventByTokenUseCase,
      )
    ).handle(token);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [CalendarEvent])
  async getCalendarEventByUserId(
    @Args("userId", { type: () => Int }) userId: number,
  ): Promise<CalendarEvent[]> {
    return (
      await this.uncontextualUseCaseFactory.create(
        GetCalendarEventsByUserIdUseCase,
      )
    ).handle(userId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => CalendarEvent)
  async createCalendarEvent(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("dto") dto: CreateCalendarEventDto,
  ): Promise<CalendarEvent> {
    return (
      await this.useCaseFactory.create(CreateCalendarEventUseCase)
    ).handle(context, dto);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => CalendarEvent)
  async updateCalendarEvent(
    @Args("id") id: number,
    @Args("dto") dto: CreateCalendarEventDto,
  ): Promise<CalendarEvent> {
    return (
      await this.uncontextualUseCaseFactory.create(UpdateCalendarEventUseCase)
    ).handle(id, dto);
  }
}
