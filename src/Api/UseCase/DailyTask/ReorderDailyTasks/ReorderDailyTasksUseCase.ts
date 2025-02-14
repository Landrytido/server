// src/UseCase/DailyTask/ReorderDailyTasks/ReorderDailyTasksUseCase.ts
import { Injectable } from '@nestjs/common';
import { ContextualGraphqlRequest, UseCase } from '../../../../index';
import DailyTaskRepository from '../../../Repository/DailyTask/DailyTaskRepository';
import { DailyTask } from '@prisma/client';
import { ReorderDailyTasksDto } from '../../../Dto/DailyTaskDto/ReorderDailyTasksDto';

@Injectable()
export default class ReorderDailyTasksUseCase implements UseCase<Promise<DailyTask[]>, [dto: ReorderDailyTasksDto]> {
    constructor(private readonly dailyTaskRepository: DailyTaskRepository) {}

    async handle(context: ContextualGraphqlRequest, dto: ReorderDailyTasksDto): Promise<DailyTask[]> {
	  return this.dailyTaskRepository.reorder(context.userId, dto.orderedIds);
    }
}
