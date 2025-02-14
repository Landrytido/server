// src/UseCase/DailyTask/UpdateDailyTask/UpdateDailyTaskUseCase.ts
import {Injectable} from '@nestjs/common';
import {ContextualGraphqlRequest, UseCase} from '../../../../index';
import DailyTaskRepository from '../../../Repository/DailyTask/DailyTaskRepository';
import {DailyTask} from '@prisma/client';
import {UpdateDailyTaskDto} from '../../../Dto/DailyTaskDto/UpdateDailyTaskDto';

@Injectable()
export default class UpdateDailyTaskUseCase implements UseCase<Promise<DailyTask>, [id: number, dto: UpdateDailyTaskDto]> {
    constructor(private readonly dailyTaskRepository: DailyTaskRepository) {
    }

    async handle(context: ContextualGraphqlRequest, id: number, dto: UpdateDailyTaskDto): Promise<DailyTask> {
	  return this.dailyTaskRepository.update(context.userId, id, dto);
    }
}
