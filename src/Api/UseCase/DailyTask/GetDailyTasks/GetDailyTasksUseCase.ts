// src/UseCase/DailyTask/GetDailyTasks/GetDailyTasksUseCase.ts
import { Injectable } from '@nestjs/common';
import { ContextualGraphqlRequest, UseCase } from '../../../../index';
import DailyTaskRepository from '../../../Repository/DailyTask/DailyTaskRepository';
import { DailyTask } from '@prisma/client';

@Injectable()
export default class GetDailyTasksUseCase implements UseCase<Promise<DailyTask[]>, [date?: Date]> {
    constructor(private readonly dailyTaskRepository: DailyTaskRepository) {}

    async handle(context: ContextualGraphqlRequest, date?: Date): Promise<DailyTask[]> {
	  const targetDate = date ? new Date(date) : new Date();
	  targetDate.setHours(0, 0, 0, 0);
	  return this.dailyTaskRepository.findByUserAndDate(context.userId, targetDate);
    }
}
