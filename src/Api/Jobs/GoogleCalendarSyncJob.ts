// src/Api/Jobs/GoogleCalendarSyncJob.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import UserRepository from '../Repository/UserRepository';
import UseCaseFactory from '../UseCase/UseCaseFactory';
import { ContextualGraphqlRequest } from '../../index';
import SyncCalendarEventsFromGoogleUseCase
    from "../UseCase/CalendarEvent/SyncCalendarEventsFromGoogle/SyncCalendarEventsFromGoogleUseCase";

@Injectable()
export class GoogleCalendarSyncJob {
    constructor(
	    private readonly userRepository: UserRepository,
	    private readonly useCaseFactory: UseCaseFactory,
    ) {}

    // Example: run every hour.
    @Cron(CronExpression.EVERY_HOUR)
    async handleGoogleCalendarSyncJob(): Promise<void> {
	  const users = await this.userRepository.getAll();
	  for (const user of users) {
		if (await this.userRepository.hasGoogleAuth(user.id)) {
		    const context = {
			  userId: user.id,
			  email: user.email,
			  roles: [],
		    } as ContextualGraphqlRequest;
		    try {
			  await (await this.useCaseFactory.create(SyncCalendarEventsFromGoogleUseCase)).handle(context);
		    } catch (error) {
			  console.error(`Error syncing Google Calendar events for user ${user.id}:`, error);
		    }
		}
	  }
    }
}
