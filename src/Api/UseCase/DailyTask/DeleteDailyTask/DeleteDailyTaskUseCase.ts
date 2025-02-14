// src/UseCase/DailyTask/DeleteDailyTask/DeleteDailyTaskUseCase.ts
import { Injectable } from '@nestjs/common';
import { ContextualGraphqlRequest, UseCase } from '../../../../index';
import DailyTaskRepository from '../../../Repository/DailyTask/DailyTaskRepository';
import { DailyTask } from '@prisma/client';

@Injectable()
export default class DeleteDailyTaskUseCase implements UseCase<Promise<DailyTask>, [id: number]> {
    constructor(private readonly dailyTaskRepository: DailyTaskRepository) {}

    async handle(context: ContextualGraphqlRequest, id: number): Promise<DailyTask> {
	  return this.dailyTaskRepository.delete(context.userId, id);
    }
}
