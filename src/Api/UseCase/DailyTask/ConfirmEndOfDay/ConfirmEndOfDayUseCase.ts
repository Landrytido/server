// src/UseCase/DailyTask/ConfirmEndOfDay/ConfirmEndOfDayUseCase.ts
import { Injectable } from '@nestjs/common';
import { ContextualGraphqlRequest, UseCase } from '../../../../index';
import DailyTaskRepository from '../../../Repository/DailyTask/DailyTaskRepository';
import DailyPlanRepository from '../../../Repository/DailyTask/DailyPlanRepository';

@Injectable()
export default class ConfirmEndOfDayUseCase implements UseCase<Promise<boolean>, []> {
    constructor(
	    private readonly dailyTaskRepository: DailyTaskRepository,
	    private readonly dailyPlanRepository: DailyPlanRepository
    ) {}

	async handle(context: ContextualGraphqlRequest): Promise<boolean> {
		// Get current date as YYYY-MM-DD string
		const now = new Date();
		const todayString = now.toISOString().split('T')[0];

		// Create Date objects (these will be used for display/logging, but we'll use strings for matching)
		const today = new Date(`${todayString}T00:00:00.000Z`);

		// Calculate tomorrow's date string
		const tomorrowDate = new Date(now);
		tomorrowDate.setDate(tomorrowDate.getDate() + 1);
		const tomorrowString = tomorrowDate.toISOString().split('T')[0];
		const tomorrow = new Date(`${tomorrowString}T00:00:00.000Z`);

		console.log(`Processing day: ${todayString} (${today.toISOString()}) to ${tomorrowString} (${tomorrow.toISOString()})`);

		// Process all of today's tasks using string-based date identification
		await this.dailyTaskRepository.confirmEndOfDay(context.userId, today, tomorrow);

		// Mark today as confirmed in DailyPlan
		await this.dailyPlanRepository.confirmDay(context.userId, todayString, true);

		return true;
	}
}
