// src/UseCase/DailyTask/CreateDailyTask/CreateDailyTaskUseCase.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { ContextualGraphqlRequest, UseCase } from '../../../../index';
import DailyTaskRepository from '../../../Repository/DailyTask/DailyTaskRepository';
import { DailyTask } from '@prisma/client';
import { CreateDailyTaskDto } from '../../../Dto/DailyTaskDto/CreateDailyTaskDto';

@Injectable()
export default class CreateDailyTaskUseCase implements UseCase<Promise<DailyTask>, [dto: CreateDailyTaskDto]> {
    constructor(private readonly dailyTaskRepository: DailyTaskRepository) {}

    async handle(context: ContextualGraphqlRequest, dto: CreateDailyTaskDto): Promise<DailyTask> {
	  // Détermine la date planifiée (normalisée à minuit)
	  const scheduledDate = dto.scheduledDate ? new Date(dto.scheduledDate) : new Date();
	  scheduledDate.setHours(0, 0, 0, 0);

	  // Si la tâche est planifiée pour demain, on impose une limite de 6 tâches.
	  const today = new Date();
	  today.setHours(0, 0, 0, 0);
	  if (scheduledDate.getTime() > today.getTime()) {
		const count = await this.dailyTaskRepository.countTasksByUserAndDate(context.userId, scheduledDate);
		if (count >= 6) {
		    throw new BadRequestException('Vous ne pouvez pas planifier plus de 6 tâches pour demain.');
		}
	  }

	  return this.dailyTaskRepository.create(context.userId, dto);
    }
}
