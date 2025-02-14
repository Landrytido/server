import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ContextualRequest } from "src/Core/Decorator/ContextualRequest";
import SaveMeetingDto from "../UseCase/Meeting/SaveMeetingDto";
import UseCaseFactory from "../UseCase/UseCaseFactory";
import { ContextualGraphqlRequest } from "src";
import SaveMeetingUseCase from "../UseCase/Meeting/SaveMeetingUseCase";
import DeleteMeetingUseCase from "../UseCase/Meeting/DeleteMeetingUseCase";
import GetMeetingUseCase from "../UseCase/Meeting/GetMeetingUseCase";
import GetAllMeetingUseCase from "../UseCase/Meeting/GetAllMeetingUseCase";
import GraphqlAuthGuard from "src/Core/Security/Guard/GraphqlAuthGuard";
import { UseGuards } from "@nestjs/common";
import { Meeting } from "../Entity/Meeting";
import GetMeetingByUserIdUseCase from "../UseCase/Meeting/GetMeetingByUserIdUseCase";

@Resolver(Meeting)
@UseGuards(GraphqlAuthGuard)
export default class MeetingResolver {
  constructor(private readonly serviceFactory: UseCaseFactory) {}

  @Mutation(() => Meeting)
  async saveMeeting(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("dto") dto: SaveMeetingDto
  ) {
    return (await this.serviceFactory.create(SaveMeetingUseCase)).handle(
      context,
      dto
    );
  }

  @Query(() => Meeting)
  async getMeeting(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("id", { type: () => Int }) id: number
  ) {
    return (await this.serviceFactory.create(GetMeetingUseCase)).handle(
      context,
      id
    );
  }

  @Query(() => [Meeting])
  async getAllMeeting(@ContextualRequest() context: ContextualGraphqlRequest) {
    return (await this.serviceFactory.create(GetAllMeetingUseCase)).handle(
      context
    );
  }

  @Query(() => [Meeting])
  async meetingByUserId(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("userId", { type: () => Int }) userId: number
  ) {
    return (await this.serviceFactory.create(GetMeetingByUserIdUseCase)).handle(
      context
    );
  }

  @Mutation(() => Meeting)
  async deleteMeeting(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("id", { type: () => Int }) id: number
  ) {
    return (await this.serviceFactory.create(DeleteMeetingUseCase)).handle(
      context,
      id
    );
  }
}
