// src/Api/Resolvers/GoogleCalendarResolver.ts
import { Resolver, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import UseCaseFactory from "../../UseCase/UseCaseFactory";
import GraphqlAuthGuard from "../../../Core/Security/Guard/GraphqlAuthGuard";
import {ContextualRequest} from "../../../Core/Decorator/ContextualRequest";
import {ContextualGraphqlRequest} from "../../../index";
import SyncCalendarEventsFromGoogleUseCase
    from "../../UseCase/CalendarEvent/SyncCalendarEventsFromGoogle/SyncCalendarEventsFromGoogleUseCase";

@Resolver()
export class GoogleCalendarResolver {
    constructor(private readonly useCaseFactory: UseCaseFactory) {}

    /**
     * GraphQL Mutation to manually trigger synchronization of Google Calendar events.
     */
    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => Boolean, { description: 'Synchronize Google Calendar events' })
    async syncGoogleCalendar(
	    @ContextualRequest() context: ContextualGraphqlRequest,
    ): Promise<boolean> {
	  try {
		await (await this.useCaseFactory.create(SyncCalendarEventsFromGoogleUseCase)).handle(context);
		return true;
	  } catch (error) {
		console.error('Error synchronizing Google Calendar events', error);
		return false;
	  }
    }
}
