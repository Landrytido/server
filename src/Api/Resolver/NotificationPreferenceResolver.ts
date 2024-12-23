import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { NotificationPreference } from "../Entity/NotificationPreference";
import UseCaseFactory from "../UseCase/UseCaseFactory";
import { UseGuards } from "@nestjs/common";
import GraphqlAuthGuard from "src/Core/Security/Guard/GraphqlAuthGuard";
import { ContextualRequest } from "src/Core/Decorator/ContextualRequest";
import { ContextualGraphqlRequest } from "src";
import { SaveNotificationPreferenceDto } from "../UseCase/Notifications/NotificationPreference/CreateNotificationPreference/SaveNotificationPreferenceDto";

import CreateNotificationPreferenceUseCase from "../UseCase/Notifications/NotificationPreference/CreateNotificationPreference/CreateNotificationPreferenceUseCase";
import DeleteNotificationUseCase from "../UseCase/Notifications/NotificationPreference/DeleteNotificationPreference/DeleteNotificationPreferenceUseCase";
import GetNotificationPreferenceUseCase from "../UseCase/Notifications/NotificationPreference/GetNotificationPreference/GetNotificationPreferenceUseCase";

@Resolver(NotificationPreference)
@UseGuards(GraphqlAuthGuard)
export default class NotificationPreferenceResolver {
  constructor(private readonly serviceFactory: UseCaseFactory) {}

  @Mutation(() => NotificationPreference)
  async createNotificationPreference(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("dto") dto: SaveNotificationPreferenceDto
  ) {
    const createdPreferences = await (
      await this.serviceFactory.create(CreateNotificationPreferenceUseCase)
    ).handle(context, dto);
    console.log("notifPref resolver:", createdPreferences); //à supp
    return createdPreferences;
  }

  @Mutation(() => NotificationPreference)
  async deleteNotificationPreference(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args("notificationPreferenceId", { type: () => Int })
    notificationPreferenceId: number
  ) {
    const deletedNotificationPreference = await (
      await this.serviceFactory.create(DeleteNotificationUseCase)
    ).handle(context, notificationPreferenceId);
    return deletedNotificationPreference;
  }

  @Query(() => NotificationPreference)
  async getNotificationPreference(
    @ContextualRequest() context: ContextualGraphqlRequest
  ) {
    const getNotificationPreference = await (
      await this.serviceFactory.create(GetNotificationPreferenceUseCase)
    ).handle(context);
    return getNotificationPreference;
  }
}
