// src/UseCase/DailyTask/GetTasksCompletedOn/GetTasksCompletedOnUseCase.ts
import { Injectable } from '@nestjs/common';
import { ContextualGraphqlRequest, UseCase } from '../../../../index';
import {CombinedTaskDto} from "../../../Dto/DailyTaskDto/CombinedTaskDto";
import DailyTaskRepository from "../../../Repository/DailyTask/DailyTaskRepository";

@Injectable()
export default class GetTasksCompletedOnUseCase implements UseCase<Promise<CombinedTaskDto[]>, [date: Date]> {
    constructor(private readonly dailyTaskRepository: DailyTaskRepository) {}

    /**
     *
     * @param context
     * @param date
     */
    async handle(context: ContextualGraphqlRequest, date: Date): Promise<CombinedTaskDto[]> {
	  // Use the repository to fetch tasks created on the provided date.
	  return this.dailyTaskRepository.getTasksCompletedOn(context.userId, date);
    }
}
