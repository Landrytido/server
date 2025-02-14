// src/UseCase/DailyTask/GetTasksCreatedOn/GetTasksCreatedOnUseCase.ts

import { Injectable } from '@nestjs/common';
import { ContextualGraphqlRequest, UseCase } from '../../../../index';
import {CombinedTaskDto} from "../../../Dto/DailyTaskDto/CombinedTaskDto";
import DailyTaskRepository from "../../../Repository/DailyTask/DailyTaskRepository";

@Injectable()
export default class GetTasksCreatedOnUseCase implements UseCase<Promise<CombinedTaskDto[]>, [date: Date]> {
    constructor(private readonly dailyTaskRepository: DailyTaskRepository) {}

    /**
     * Retrieves all tasks created on the specified day.
     *
     * This use case fetches tasks from both the active DailyTask table and the archived DailyTaskHistory table,
     * filtering them by their createdAt field for the given date.
     *
     * @param context - The contextual request which includes the userId.
     * @param date - The date for which tasks should be retrieved (a Date object).
     * @returns A promise that resolves to an array of CombinedTaskDto records.
     */
    async handle(context: ContextualGraphqlRequest, date: Date): Promise<CombinedTaskDto[]> {
	  // Use the repository to fetch tasks created on the provided date.
	  return this.dailyTaskRepository.getTasksCreatedOn(context.userId, date);
    }
}
