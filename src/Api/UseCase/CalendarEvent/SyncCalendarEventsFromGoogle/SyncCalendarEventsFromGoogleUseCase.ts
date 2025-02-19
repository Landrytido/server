// src/UseCase/CalendarEvent/SyncCalendarEventsFromGoogleUseCase.ts
import { Injectable, Logger } from '@nestjs/common';
import {ContextualGraphqlRequest, UseCase} from "../../../../index";
import UserRepository from "../../../Repository/UserRepository";
import GoogleCalendarService from "../../../Services/GoogleCalendarService";
import CalendarEventRepository from "../../../Repository/CalendarEvent/CalendarEventRepository";

@Injectable()
export default class SyncCalendarEventsFromGoogleUseCase implements UseCase<Promise<void>, []> {
    private readonly logger = new Logger(SyncCalendarEventsFromGoogleUseCase.name);

    constructor(
	    private readonly userRepository: UserRepository,
	    private readonly googleCalendarService: GoogleCalendarService,
	    private readonly calendarEventRepository: CalendarEventRepository,
    ) {}

    async handle(context: ContextualGraphqlRequest): Promise<void> {
	  if (!(await this.userRepository.hasGoogleAuth(context.userId))) {
		return;
	  }

	  const eventCount = await this.calendarEventRepository.syncFromGoogleCalendar(
		  context.userId,
		  this.googleCalendarService,
	  );
	  const taskCount = await this.calendarEventRepository.syncFromGoogleTasks(
		  context.userId,
		  this.googleCalendarService,
	  );
	  this.logger.log(`Synced ${eventCount} events and ${taskCount} tasks from Google for user ${context.email}.`);
    }
}
