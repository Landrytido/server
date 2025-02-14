// src/UseCase/DailyTask/GetDailyPlan/GetDailyPlanUseCase.ts
import { Injectable } from '@nestjs/common';
import { ContextualGraphqlRequest, UseCase } from '../../../../index';
import DailyPlanRepository from "../../../Repository/DailyTask/DailyPlanRepository";
import {DailyPlan} from "@prisma/client";

@Injectable()
export default class GetDailyPlanUseCase implements UseCase<Promise<DailyPlan | null>, [date: Date]> {
    constructor(private readonly dailyPlanRepository: DailyPlanRepository) {}

    /**
     * Retrieves the DailyPlan for a given date.
     *
     * @param context - The contextual request containing the userId.
     * @param date - The date (as a Date object) for which to get the plan.
     * @returns A promise resolving to the DailyPlan or null if not set.
     */
    async handle(context: ContextualGraphqlRequest, date: Date): Promise<DailyPlan | null> {
	  return this.dailyPlanRepository.getPlanByUserAndDate(context.userId, date);
    }
}
