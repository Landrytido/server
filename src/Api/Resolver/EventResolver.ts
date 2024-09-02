import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ContextualRequest } from "src/Core/Decorator/ContextualRequest";
import SaveEventDto from "../UseCase/Event/SaveEventDto";
import UseCaseFactory from "../UseCase/UseCaseFactory";
import { ContextualGraphqlRequest } from "src";
import SaveEventUseCase from "../UseCase/Event/SaveEventUseCase";
import DeleteEventUseCase from "../UseCase/Event/DeleteEventUseCase";
import GetEventUseCase from "../UseCase/Event/GetEventUseCase";
import GetAllEventUseCase from "../UseCase/Event/GetAllEventUseCase";
import GraphqlAuthGuard from "src/Core/Security/Guard/GraphqlAuthGuard";
import { UseGuards } from "@nestjs/common";
import { Event } from "../Entity/Event";

@Resolver(Event)
@UseGuards(GraphqlAuthGuard)
export default class EventResolver {
  constructor(private readonly serviceFactory: UseCaseFactory) {}

  @Mutation(() => Event)
  async saveEvent(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("dto") dto: SaveEventDto
  ) {
    return (await this.serviceFactory.create(SaveEventUseCase)).handle(
      context,
      dto
    );
  }

  @Query(() => Event)
  async getEvent(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("id") id: number
  ) {
    return (await this.serviceFactory.create(GetEventUseCase)).handle(
      context,
      id
    );
  }

  @Query(() => [Event])
  async getAllEvent(@ContextualRequest() context: ContextualGraphqlRequest) {
    return (await this.serviceFactory.create(GetAllEventUseCase)).handle(
      context
    );
  }

  @Mutation(() => Event)
  async deleteEvent(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("id") id: number
  ) {
    return (await this.serviceFactory.create(DeleteEventUseCase)).handle(
      context,
      id
    );
  }
}
