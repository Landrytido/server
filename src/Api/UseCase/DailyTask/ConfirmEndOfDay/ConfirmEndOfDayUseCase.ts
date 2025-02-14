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
	  const today = new Date();
	  today.setHours(0, 0, 0, 0);
	  const tomorrow = new Date(today);
	  tomorrow.setDate(tomorrow.getDate() + 1);

	  // Traite toutes les tâches d'aujourd'hui :
	  // - Tâches complétées → déplacées dans l’historique.
	  // - Tâches non complétées → reportées sur demain (avec carriedOver à true).
	  await this.dailyTaskRepository.confirmEndOfDay(context.userId, today, tomorrow);

	  // Marque la journée comme confirmée dans DailyPlan
	  await this.dailyPlanRepository.confirmDay(context.userId, today, true);

	  return true;
    }
}
