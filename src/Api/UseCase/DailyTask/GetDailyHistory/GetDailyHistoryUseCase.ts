// src/UseCase/DailyTask/GetDailyHistory/GetDailyHistoryUseCase.ts
import { Injectable } from '@nestjs/common';
import { ContextualGraphqlRequest, UseCase } from '../../../../index';
import { DailyTaskHistory } from '@prisma/client';
import DailyTaskHistoryRepository from "../../../Repository/DailyTask/DailyTaskHistoryRepository";

@Injectable()
export default class GetDailyHistoryUseCase implements UseCase<Promise<DailyTaskHistory[]>, [date: string]> {
    constructor(private readonly historyRepository: DailyTaskHistoryRepository) {}

    /**
     * Récupère l'historique des tâches pour la date fournie.
     *
     * @param context - Le contexte contenant l'ID utilisateur.
     * @param date - La date ciblée sous forme de chaîne (ex: "2025-03-15").
     * @returns Une liste de DailyTaskHistory correspondant à la journée.
     */
    async handle(context: ContextualGraphqlRequest, date: string): Promise<DailyTaskHistory[]> {
	  const targetDate = new Date(date);
	  targetDate.setHours(0, 0, 0, 0);
	  return this.historyRepository.findHistoryByUserAndDate(context.userId, targetDate);
    }
}
